import styles from "./MainUI.module.css";
import Skills from "./Skills";
import Shop from "./Shop";
import { useCallback, useContext, useRef, useState } from "react";
import { MainContext } from "../Main";
import { SoundContext } from "../../../Context/SoundContext";
import goldCoin from "/Images/GoldCoin.png";

export default function MainUI() {
  const { currentGold, setDieAmount, setTrueVision, skillTurnsRemaining } =
    useContext(MainContext);
  const { playSFX } = useContext(SoundContext);

  const [skill1Held, setSkill1Held] = useState(0);
  const [skill2Held, setSkill2Held] = useState(0);

  const skill1Active = () => {
    playSFX("Skill1");
    setDieAmount(20);
    setSkill1Held((prev) => prev - 1);
  };

  const skill2Active = () => {
    playSFX("Skill1");
    setTrueVision();
    setSkill2Held((prev) => prev - 1);
  };

  const SkillsList = [
    {
      name: "Double Dice",
      cost: "150",
      held: skill1Held,
      buy: () => setSkill1Held((prev) => prev + 1),
      active: skill1Active,
      turnsLeft: skillTurnsRemaining[0],
      description:
        "Double the amount of dice you roll for 1 turn. The numbers rolled will be from 1 - 20.",
    },
    {
      name: "True Vision",
      cost: "100",
      held: skill2Held,
      buy: () => setSkill2Held((prev) => prev + 1),
      active: skill2Active,
      turnsLeft: skillTurnsRemaining[1],
      description: "See the sum of your dice rolls for 3 turns.",
    },
  ];

  return (
    <div className={styles.MainUIRoot}>
      <div className={styles.BarCont}>
        <div className={styles.GoldCont}>
          <p className={styles.GoldText}>{currentGold}</p>
          <img src={goldCoin} className={styles.GoldImage}></img>
        </div>
        <Shop SkillsList={SkillsList} />
        <div className={styles.activePassives}>
          {SkillsList.map((skill, index) => (
            <p className={styles.SkillTurnsLeft} key={index}>
              {skill.name} - {skill.turnsLeft} turns
            </p>
          ))}
        </div>
      </div>
      <Skills SkillsList={SkillsList} />
    </div>
  );
}
