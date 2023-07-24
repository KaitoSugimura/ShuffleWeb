import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Main.module.css";
import shuffle from "./Shuffle";
import Card from "./Card";
import Background from "./Graphics/Background";
import SoundSetting from "../../Tools/SoundSetting";
import { GameContext } from "../../GameContext";
import MapLineup from "./Data/MapLineup";
import Enemy from "./Enemy/Enemy";
import { SoundContext } from "../../Context/SoundContext";
import ActionBar from "./ActionBar/ActionBar";
import MainUI from "./Shop&Skills/MainUI";
import TrueVision from "./SkillUI/TrueVision";

export const MainContext = createContext();

export default function Main() {
  const { playSFX } = useContext(SoundContext);
  const { setGameState } = useContext(GameContext);
  const enemyRef = useRef(null);

  const [Slimes, setSlimes] = useState(MapLineup[0].Slimes);
  const [moveRoomAnim, setMoveRoomAnim] = useState(false);

  const [cards, setCards] = useState(null);
  const [combatState, setCombatState] = useState([0, 0]); // Switch to using Enum later
  const iRef = useRef(0);

  const currentSlimeIndexRef = useRef(0);
  const currentNumberOfCards = useRef(10);
  const comboRef = useRef(0);

  const currentMapLineupIndexRef = useRef(0);

  const [currentGoldAmount, setCurrentGoldAmount] = useState(100);
  const addGoldAmount = (a) => {
    setCurrentGoldAmount((prev) => prev + a);
  };
  const doubleDiceTurnsRemaining = useRef(0);
  const trueVisionTurnsRemaining = useRef(0);

  const [x, force] = useState(0);

  // Initial set
  useEffect(() => {
    if (enemyRef.current) {
      enemyRef.current.setEnemy(
        Slimes[0].image,
        Slimes[0].name,
        Slimes[0].health
      );
    }
  }, []);

  const getNewSplitShuffleArrays = () => {
    const numberOfCards = currentNumberOfCards.current;
    const arr = shuffle(numberOfCards);
    return [
      arr.slice(0, numberOfCards / 2),
      arr.slice(numberOfCards / 2, numberOfCards),
    ];
  };

  const getDamageMultiplier = () => {
    if (comboRef.current === 0) return 1;
    return comboRef.current;
  };

  const resetEnemy = () => {
    setCards(null);
    enemyRef.current.setEnemy(
      Slimes[currentSlimeIndexRef.current].image,
      Slimes[currentSlimeIndexRef.current].name,
      Slimes[currentSlimeIndexRef.current].health
    );
    setCombatState([0, 0]);
  };

  useEffect(() => {
    resetEnemy();
  }, [Slimes]);

  const onEnemyDeath = () => {
    playSFX("Death");
    setTimeout(() => {
      addGoldAmount(Slimes[currentSlimeIndexRef.current].reward);
      currentSlimeIndexRef.current++;
      comboRef.current = 0;
      if (currentSlimeIndexRef.current >= Slimes.length) {
        playSFX("Steps");
        setMoveRoomAnim(true);
        setTimeout(() => {
          currentMapLineupIndexRef.current++;
          if (currentMapLineupIndexRef.current >= MapLineup.length) {
            setGameState("end");
            return;
          }
          currentSlimeIndexRef.current = 0;
          setMoveRoomAnim(false);
          setSlimes(MapLineup[currentMapLineupIndexRef.current].Slimes);
        }, 1000);
      } else {
        resetEnemy();
      }
    }, 1000);
  };

  const enemyOnTakeDamage = () => {
    playSFX("Hit");
    setCombatState([0, iRef.current + 1]);
  };

  const setDieAmount = useCallback(
    (amount) => {
      doubleDiceTurnsRemaining.current += 1;
      if (currentNumberOfCards.current === amount) return;
      currentNumberOfCards.current = amount;
      if (combatState[0] === 1) {
        setCards(getNewSplitShuffleArrays());
      }
      force(Date.now());
    },
    [combatState]
  );

  const setTrueVision = () => {
    trueVisionTurnsRemaining.current += 3;
    force(Date.now());
  };

  const handleOnRollAttackClick = (event) => {
    event.preventDefault();
    playSFX("Roll");
    setCards(getNewSplitShuffleArrays());
    setCombatState([1, 0]);
  };

  const handleOnActionBarSelectionClick = (event, i) => {
    event.preventDefault();
    iRef.current = i;

    let sum = cards[i].reduce((a, b) => a + b, 0);

    if (
      sum >=
      Math.ceil(
        (currentNumberOfCards.current * (currentNumberOfCards.current + 1)) / 4
      )
    ) {
      playSFX("PowerUp");
      comboRef.current++;
    } else {
      comboRef.current = 0;
    }
    playSFX("Select");

    setCombatState([i + 2, i + 1]);
    setTimeout(() => {
      enemyRef.current.takeDamage(Math.ceil(sum * getDamageMultiplier()));
    }, 500);

    doubleDiceTurnsRemaining.current -=
      doubleDiceTurnsRemaining.current > 0 ? 1 : 0;
    currentNumberOfCards.current =
      doubleDiceTurnsRemaining.current > 0 ? 20 : 10;
    trueVisionTurnsRemaining.current -=
      trueVisionTurnsRemaining.current > 0 ? 1 : 0;
  };

  return (
    <MainContext.Provider
      value={{
        setDieAmount,
        setTrueVision,
        currentGold: currentGoldAmount,
        addGold: addGoldAmount,
        skillTurnsRemaining: [
          doubleDiceTurnsRemaining.current,
          trueVisionTurnsRemaining.current,
        ],
      }}
    >
      <div className={styles.mainRoot}>
        <SoundSetting
          style={{
            top: `5vh`,
            left: `5vh`,
          }}
        />

        <div className={moveRoomAnim ? styles.moveRoomAnim : null}>
          <Background
            src={MapLineup[currentMapLineupIndexRef.current].Background}
          />
        </div>
        <MainUI />

        <Enemy
          ref={enemyRef}
          onEnemyDeath={onEnemyDeath}
          enemyOnTakeDamage={enemyOnTakeDamage}
        />

        {comboRef.current > 0 && (
          <div className={styles.comboCont}>
            <p className={styles.comboText}>
              <span>{comboRef.current}</span> Combo
            </p>
            <p className={styles.damageText}>
              <span>x{getDamageMultiplier()}</span> Damage!
            </p>
          </div>
        )}

        {cards && (
          <>
            <div
              className={styles.leftBoxPos}
              style={{
                // transform:
                //   combatState[1] === 1
                //     ? "translate(-8%, 0%)"
                //     : "translate(-108%, 0%)",
                bottom: combatState[1] === 1 ? "68%" : "20%",
                transition:
                  combatState[1] === 1
                    ? "transform 0.5s ease-out, bottom 0.5s ease-in"
                    : "none",
              }}
            >
              {trueVisionTurnsRemaining.current > 0 && (
                <TrueVision cards={cards[0]} hidden={combatState[1] === 1} />
              )}
              {cards[0].map((card, index) => (
                <Card
                  key={index}
                  number={card}
                  bAttack={combatState[1] === 1}
                />
              ))}
            </div>
            <div
              className={styles.rightBoxPos}
              style={{
                // transform:
                //   combatState[1] === 2
                //     ? "translate(-92%, 0%)"
                //     : "translate(8%, 0%)",
                bottom: combatState[1] === 2 ? "68%" : "20%",
                transition:
                  combatState[1] === 2
                    ? "transform 0.5s ease-out, bottom 0.5s ease-in"
                    : "none",
              }}
            >
              {trueVisionTurnsRemaining.current > 0 && (
                <TrueVision cards={cards[1]} hidden={combatState[1] === 2} />
              )}
              {cards[1].map((card, index) => (
                <Card
                  key={index}
                  number={card}
                  bAttack={combatState[1] === 2}
                />
              ))}
            </div>
          </>
        )}

        <ActionBar
          ActionCombatState={combatState[0]}
          handleOnRollAttackClick={handleOnRollAttackClick}
          handleOnActionBarSelectionClick={handleOnActionBarSelectionClick}
        />
      </div>
    </MainContext.Provider>
  );
}
