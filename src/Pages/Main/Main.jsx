import { useContext, useRef, useState } from "react";
import styles from "./Main.module.css";
import shuffle from "./Shuffle";
import Card from "./Card";
import Background from "./Graphics/Background";
import { GameContext } from "../../GameContext";
import Slimes from "./Data/SlimeLineup";

export default function Main() {
  const { setGameState } = useContext(GameContext);

  const getNewSplitShuffleArrays = () => {
    const arr = shuffle(10);
    return [arr.slice(0, 5), arr.slice(5, 10)];
  };
  const [cards, setCards] = useState(null);
  const [combatState, setCombatState] = useState([0, 0]); // Switch to using Enum later

  const currentSlimeIndexRef = useRef(0);
  const [enemyMaxHealth, setEnemyMaxHealth] = useState(Slimes[0].health);
  const [enemyCurrentHealth, setEnemyCurrentHealth] = useState(enemyMaxHealth);

  const comboRef = useRef(0);

  const getDamageMultiplier = () => {
    if (comboRef.current === 0) return 1;
    return 1 + 0.5 * (comboRef.current - 1);
  };

  const getActionComponent = () => {
    switch (combatState[0]) {
      case 0:
        return (
          <button
            className={`${styles.bottomCenter} ${styles.rollAgainButton}`}
            onClick={(event) => {
              event.preventDefault();
              setCards(getNewSplitShuffleArrays());
              setCombatState([1, 0]);
            }}
          >
            Roll Attack
          </button>
        );
      case 1:
        const findSum = (i) => {
          let sum = 0;
          cards[i].forEach((card) => {
            sum += card;
          });
          return sum;
        };
        const handleOnClick = (event, i) => {
          event.preventDefault();
          const sum = findSum(i);
          if (sum > 27) comboRef.current++;
          else comboRef.current = 0;
          const damage = Math.ceil(sum * getDamageMultiplier());
          setCombatState([i + 2, i + 1]);
          setTimeout(() => {
            setEnemyCurrentHealth((prev) => {
              let newHP = prev - damage;
              if (newHP <= 0) {
                setTimeout(() => {
                  currentSlimeIndexRef.current++;
                  comboRef.current = 0;
                  if (currentSlimeIndexRef.current >= Slimes.length) {
                    setGameState("end");
                  } else {
                    setCards(null);
                    setEnemyMaxHealth(
                      Slimes[currentSlimeIndexRef.current].health
                    );
                    setEnemyCurrentHealth(
                      Slimes[currentSlimeIndexRef.current].health
                    );
                    setCombatState([0, i + 1]);
                  }
                }, 1000);
                setCombatState([i + 2, i + 1, damage]);
              } else {
                setCombatState([0, i + 1, damage]);
              }
              return newHP;
            });
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
      <Background />

      <img
        src={Slimes[currentSlimeIndexRef.current].image}
        className={`${styles.enemyImage} ${
          enemyCurrentHealth <= 0 ? styles.deathAnim : ""
        }`}
      ></img>

      <div className={styles.topBarContainer}>
        <p className={styles.enemyName}>
          {Slimes[currentSlimeIndexRef.current].name}
        </p>
        <div className={styles.enemyHealthBar}>
          <div
            className={styles.enemyHealthBarFill}
            style={{
              width: `${Math.max(
                (enemyCurrentHealth / enemyMaxHealth) * 100,
                0
              )}%`,
            }}
          ></div>
        </div>
      </div>

      {combatState[2] && (
        <div
          className={styles.damageCont}
          style={{
            top: `${Math.random() * 20 + 35}%`,
            left: `${Math.random() * 15 + 42.5}%`,
          }}
        >
          {combatState[2]}
        </div>
      )}

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
            {combatState[1] === 1 ? (
              <div className={styles.leftCardBoxNoAfter}>
                {cards[0].map((card, index) => (
                  <Card key={index} number={card} bAttack={true} />
                ))}
              </div>
            ) : (
              <div className={styles.leftCardBox}>
                {cards[0].map((card, index) => (
                  <Card key={index} number={card} bAttack={false} />
                ))}
              </div>
            )}
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
            {combatState[1] === 2 ? (
              <div className={styles.rightCardBoxNoAfter}>
                {cards[1].map((card, index) => (
                  <Card key={index} number={card} bAttack={true} />
                ))}
              </div>
            ) : (
              <div className={styles.rightCardBox}>
                {cards[1].map((card, index) => (
                  <Card key={index} number={card} bAttack={false} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {getActionComponent()}
    </div>
  );
}
