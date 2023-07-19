import { useContext } from "react";
import styles from "./End.module.css";
import settingBG from "/Images/Title.jpg";
import { GameContext } from "../../GameContext";

export default function End() {
  const { setGameState } = useContext(GameContext);

  return (
    <div
      style={{
        backgroundImage: `url(${settingBG})`,
      }}
      className={styles.endRoot}
    >
      <h1 className={styles.title}>You win!</h1>

      <button
        className={styles.returnButton}
        onClick={() => {
          setGameState("title");
        }}
      >
        return to title screen
      </button>
    </div>
  );
}
