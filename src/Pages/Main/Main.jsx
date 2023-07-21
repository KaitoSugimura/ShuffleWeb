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

export default function Main() {
  const { playSFX } = useContext(SoundContext);
  const { setGameState } = useContext(GameContext);
  const enemyRef = useRef(null);

  const [cards, setCards] = useState(null);
  const [combatState, setCombatState] = useState([0, 0]); // Switch to using Enum later
  const iRef = useRef(0);

  const currentSlimeIndexRef = useRef(0);
  const comboRef = useRef(0);

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
    const arr = shuffle(10);
    return [arr.slice(0, 5), arr.slice(5, 10)];
  };

  const getDamageMultiplier = () => {
    if (comboRef.current === 0) return 1;
    return 1 + 0.5 * (comboRef.current - 1);
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

  const getActionComponent = () => {
    switch (combatState[0]) {
      case 0:
        return (
          <button
            className={`${styles.bottomCenter} ${styles.selectionButton}`}
            onClick={(event) => {
              event.preventDefault();
              playSFX("Roll");
              setCards(getNewSplitShuffleArrays());
              setCombatState([1, 0]);
            }}
          >
            Roll Attack
          </button>
        );
      case 1:
        const handleOnClick = (event, i) => {
          event.preventDefault();
          playSFX("Select");
          iRef.current = i;
          let sum = 0;
          cards[i].forEach((card) => {
            sum += card;
          });
          if (sum > 27) comboRef.current++;
          else comboRef.current = 0;

          setCombatState([i + 2, i + 1]);
          setTimeout(() => {
            enemyRef.current.takeDamage(Math.ceil(sum * getDamageMultiplier()));
          }, 500);
        };
        return (
          <div className={styles.bottomCenter}>
            <button
              className={`${styles.selectionButton} ${styles.selectionButtonLeft}`}
              onClick={(event) => {
                handleOnClick(event, 0);
              }}
            >
              Left
            </button>
            <button
              className={`${styles.selectionButton} ${styles.selectionButtonRight}`}
              onClick={(event) => {
                handleOnClick(event, 1);
              }}
            >
              Right
            </button>
          </div>
        );
      default:
        return <></>;
    }
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

      {cards && (
        <>
          <div
            className={styles.leftBoxPos}
            style={{
              transform:
                combatState[1] === 1
                  ? "translate(-8%, 0%)"
                  : "translate(-108%, 0%)",
              top: combatState[1] === 1 ? "38%" : "65%",
              transition:
                combatState[1] === 1
                  ? "transform 0.5s ease-out, top 0.5s ease-in"
                  : "none",
            }}
          >
            <div className={styles.leftCardBox}>
              {cards[0].map((card, index) => (
                <Card
                  key={index}
                  number={card}
                  bAttack={combatState[1] === 1}
                />
              ))}
            </div>
          </div>
          <div
            className={styles.rightBoxPos}
            style={{
              transform:
                combatState[1] === 2
                  ? "translate(-92%, 0%)"
                  : "translate(8%, 0%)",
              top: combatState[1] === 2 ? "38%" : "65%",
              transition:
                combatState[1] === 2
                  ? "transform 0.5s ease-out, top 0.5s ease-in"
                  : "none",
            }}
          >
            <div className={styles.rightCardBox}>
              {cards[1].map((card, index) => (
                <Card
                  key={index}
                  number={card}
                  bAttack={combatState[1] === 2}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {getActionComponent()}
    </div>
  );
}
