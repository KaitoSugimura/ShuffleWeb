import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Main.module.css";
import shuffle from "./Shuffle";
import Card from "./Card";
import Background from "./Graphics/Background";
import SoundSetting from "../../Tools/SoundSetting";
import { GameContext } from "../../GameContext";
import Slimes from "./Data/SlimeLineup";
import Enemy from "./Enemy/Enemy";
import { SoundContext } from "../../Context/SoundContext";
import ActionBar from "./ActionBar/ActionBar";

export default function Main() {
  const { playSFX } = useContext(SoundContext);
  const { setGameState } = useContext(GameContext);
  const enemyRef = useRef(null);

  const [cards, setCards] = useState(null);
  const [combatState, setCombatState] = useState([0, 0]); // Switch to using Enum later
  const iRef = useRef(0);

  const currentSlimeIndexRef = useRef(0);
  const currentNumberOfCards = useRef(10);
  const comboRef = useRef(0);

  const doubleDiceTurnsRemaining = useRef(0);
  const [skillDoubleDieUsed, setSkillDoubleDieUsed] = useState(false);

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

  const onEnemyDeath = () => {
    playSFX("Death");
    setTimeout(() => {
      currentSlimeIndexRef.current++;
      comboRef.current = 0;
      if (currentSlimeIndexRef.current >= Slimes.length) {
        setGameState("end");
      } else {
        setCards(null);
        enemyRef.current.setEnemy(
          Slimes[currentSlimeIndexRef.current].image,
          Slimes[currentSlimeIndexRef.current].name,
          Slimes[currentSlimeIndexRef.current].health
        );
        setCombatState([0, 0]);
      }
    }, 1000);
  };

  const enemyOnTakeDamage = () => {
    playSFX("Hit");
    setCombatState([0, iRef.current + 1]);
  };

  const setDieAmount = (amount) => {
    currentNumberOfCards.current = amount;
    doubleDiceTurnsRemaining.current = 1;
    if (combatState[0] === 1) {
      setCards(getNewSplitShuffleArrays());
    }
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
    let sum = 0;
    cards[i].forEach((card) => {
      sum += card;
    });
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

    doubleDiceTurnsRemaining.current--;
    currentNumberOfCards.current =
      doubleDiceTurnsRemaining.current > 0 ? 20 : 10;
  };

  return (
    <div className={styles.mainRoot}>
      <SoundSetting
        style={{
          top: `5vh`,
          left: `5vh`,
        }}
      />

      <Background />

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

      {!skillDoubleDieUsed && (
        <button
          className={styles.skillButton}
          onClick={() => {
            playSFX("Skill1");
            setSkillDoubleDieUsed(true);
            setDieAmount(20);
          }}
        >
          Double Die
        </button>
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
            {cards[0].map((card, index) => (
              <Card key={index} number={card} bAttack={combatState[1] === 1} />
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
            {cards[1].map((card, index) => (
              <Card key={index} number={card} bAttack={combatState[1] === 2} />
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
  );
}
