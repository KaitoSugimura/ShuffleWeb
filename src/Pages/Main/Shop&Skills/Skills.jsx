import styles from "./Skills.module.css";

export default function Skills({ SkillsList }) {


  return (
    <div className={styles.skillsRoot}>
      {SkillsList.map((skill, index) => (
        <button
          className={`${styles.skillButton} ${
            skill.currentTurnsLeft > 0
              ? ""
              : styles.skillButtonInactive
          }`}
          onClick={() => {
            if (skill.currentTurnsLeft > 0) {
              skill.active();
            }
          }}
          key={index}
        >
          {skill.name}
        </button>
      ))}
    </div>
  );
}
