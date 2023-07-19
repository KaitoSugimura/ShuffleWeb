import { useRef, useState } from "react";
import styles from "./Main.module.css";
import shuffle from "./Shuffle";
import Card from "./Card";
import settingBG from "/Images/BackgroundField.png";
import slime1 from "/Enemies/defaultSlime.gif";

export default function Main() {
  const getNewSplitShuffleArrays = () => {
    const arr = shuffle(10);
    return [arr.slice(0, 5), arr.slice(5, 10)];
  };
  const [cards, setCards] = useState(getNewSplitShuffleArrays());
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  const [combatState, setCombatState] = useState([0, 0]); // Switch to using Enum later

  const [enemyMaxHealth, setEnemyMaxHealth] = useState(500);
  const [enemyCurrentHealth, setEnemyCurrentHealth] = useState(enemyMaxHealth);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth * 0.5) * 0.002;
    const y = (clientY - window.innerHeight * 0.5) * -0.002;

    setTiltValues({ x, y }); // Not efficient at all, but it works for now...
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
            Roll Again
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
        return (
          <div className={styles.bottomCenter}>
            <button
              className={`${styles.selectionButton} ${styles.selectionButtonLeft}`}
              onClick={(event) => {
                event.preventDefault();
                setCombatState([2, 1]);
                setTimeout(() => {
                  setEnemyCurrentHealth((prev) => prev - findSum(0));
                  setCombatState([0, 1]);
                }, 500);
              }}
            >
              Left
            </button>
            <button
              className={`${styles.selectionButton} ${styles.selectionButtonRight}`}
              onClick={(event) => {
                event.preventDefault();
                setCombatState([3, 2]);
                setTimeout(() => {
                  setEnemyCurrentHealth((prev) => prev - findSum(1));
                  setCombatState([0, 2]);
                }, 500);
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
    <div onMouseMove={handleMouseMove} className={styles.mainRoot}>
      {/* Most likely better to put background in its own file if this was a full project */}
      <div className={styles.BackgroundPerspective}>
        <div
          className={styles.Background}
          style={{
            backgroundImage: `url(${settingBG})`,
            transform: `rotateX(${tiltValues.y}deg) rotateY(${tiltValues.x}deg)`,
          }}
        ></div>
      </div>
      <img src={slime1} className={styles.enemyImage}></img>

      <div className={styles.topBarContainer}>
        <p className={styles.enemyName}>Normal Slime</p>
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

      <div className={styles.cardBox}>
        <div
          className={styles.leftBoxPos}
          style={{
            transform:
              combatState[1] === 1
                ? "translate(-8%, 0%)"
                : "translate(-108%, 0%)",
            top: combatState[1] === 1 ? "43%" : "65%",
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
            top: combatState[1] === 2 ? "43%" : "65%",
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
      </div>

      {getActionComponent()}
    </div>
  );
}
