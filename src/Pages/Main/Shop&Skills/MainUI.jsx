import styles from "./MainUI.module.css";
import Skills from "./Skills";
import Shop from "./Shop";
import { useCallback, useContext, useRef, useState } from "react";
import { MainContext } from "../Main";
import { SoundContext } from "../../../Context/SoundContext";

export default function MainUI() {
  const { currentGold, setDieAmount } = useContext(MainContext);
  const { playSFX } = useContext(SoundContext);

  const [skill1TurnsLeft, setSkill1TurnsLeft] = useState(1);
  const [skill2TurnsLeft, setSkill2TurnsLeft] = useState(1);

  const skill1Active = () => {
    playSFX("Skill1");
    setDieAmount(20);
    setSkill1TurnsLeft((prev) => prev - 1);
  };

  const skill2Active = () => {
    setSkill2TurnsLeft((prev) => prev - 1);
  };

  const SkillsList = [
    {
      name: "Double Dice",
      cost: "100",
      turns: 1,
      currentTurnsLeft: skill1TurnsLeft,
      active: skill1Active,
    },
    {
      name: "True Vision",
      cost: "25",
      turns: 3,
      currentTurnsLeft: skill2TurnsLeft,
      active: skill2Active,
    },
  ];

  return (
    <div className={styles.MainUIRoot}>
      <div className={styles.BarCont}>
        <div className={styles.GoldCont}>
          <p className={styles.GoldText}>{currentGold}</p>
          <img src="/Images/Gold.png" className={styles.GoldImage}></img>
        </div>
        <Shop SkillsList={SkillsList} />
      </div>
      <Skills SkillsList={SkillsList} />
    </div>
  );
}
