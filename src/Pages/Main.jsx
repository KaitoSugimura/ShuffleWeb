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
  const [combatState, setCombatState] = useState(0); // Switch to using Enum later

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth * 0.5) * 0.002;
    const y = (clientY - window.innerHeight * 0.5) * 0.002;

    setTiltValues({ x, y }); // Not efficient at all, but it works for now...
  };

  const getActionComponent = () => {
    switch (combatState) {
      case 0:
        return (
          <button
            className={`${styles.bottomCenter} ${styles.rollAgainButton}`}
            onClick={(event) => {
              event.preventDefault();
              setCards(getNewSplitShuffleArrays());
              setCombatState(1);
            }}
          >
            Roll Again
          </button>
        );
      case 1:
        return (
          <div className={styles.bottomCenter}>
            <button
              className={styles.selectionButton}
              onClick={(event) => {
                event.preventDefault();
                setCombatState(0);
              }}
            >
              Left
            </button>
            <button
              className={styles.selectionButton}
              onClick={(event) => {
                event.preventDefault();
                setCombatState(0);
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
    <div onMouseMove={handleMouseMove}>
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

        <div>
          <div className={styles.enemyHealthBar}></div>
          <p className={styles.enemyName}></p>
        </div>

      <div className={styles.cardBox}>
        <div className={styles.leftCardBox}>
          {cards[0].map((card, index) => (
            <Card key={index} number={card} />
          ))}
        </div>
        <div className={styles.rightCardBox}>
          {cards[1].map((card, index) => (
            <Card key={index} number={card} />
          ))}
        </div>
      </div>

      {getActionComponent()}


    </div>
  );
}
