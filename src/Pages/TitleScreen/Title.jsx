import { useContext, useState } from "react";
import styles from "./Title.module.css";
import settingBG from "/Images/Title.jpg";
import { GameContext } from "../../GameContext";
import SoundSetting from "../../Tools/SoundSetting";

export default function Title() {
  const { setGameState } = useContext(GameContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <>
          <div
            className={styles.LazyModalBack}
            onClick={() => {
              setShowModal(false);
            }}
          ></div>
          <div className={styles.LazyModal}>
            <div
              className={styles.closeButton}
              onClick={() => {
                setShowModal(false);
              }}
            >
              X
            </div>

            <p className={styles.descTitle}>How To Play</p>
            <p className={styles.desc}>
              1. Start by pressing the Roll Attack button.
              <br />
              2. This will roll 10 numbers from 1 to 10 in random order.
              <br />
              3. These numbers will be split in 2, left and right groups.
              <br />
              4. You will deal damage equal to the total sum of the group.
              <br />
              5. Picking the larger group consecutively will deal bonus damage!
              <br />
              6. Defeat the enemy by reducing its health to 0.
            </p>
          </div>
        </>
      )}
      <div className={styles.titleRoot}>
        <SoundSetting
          style={{
            top: `5vh`,
            left: `5vh`,
          }}
        />
        <div
          className={styles.backgroundImage}
          style={{
            backgroundImage: `url(${settingBG})`,
          }}
        ></div>
        <div>
          <h1 className={styles.title}>Shuffle Battle</h1>
          <h1 className={styles.subtitle}>Made for PureWeb TakeHome task</h1>
        </div>
        <ul className={styles.gameList}>
          <li>
            <button
              className={styles.gameListButton}
              onClick={() => {
                setGameState("main");
              }}
            >
              Start Game
            </button>
          </li>
          <li>
            <button
              className={styles.gameListButton}
              onClick={() => {
                setShowModal(true);
              }}
            >
              How to play
            </button>
          </li>
        </ul>
        <p className={styles.credits}>Made by Kaito Sugimura</p>
      </div>
    </>
  );
}
