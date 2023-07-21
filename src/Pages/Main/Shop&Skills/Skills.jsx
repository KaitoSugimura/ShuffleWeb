import styles from "./Skills.module.css";

export default function Skills({ SkillsList }) {


  return (
    <div className={styles.skillsRoot}>
      {SkillsList.map((skill, index) => (
        <button
          className={`${styles.skillButton} ${
            skill.held > 0
              ? ""
              : styles.skillButtonInactive
          }`}
          onClick={() => {
            if (skill.held > 0) {
              skill.active();
            }
          }}
          key={index}
        >
          {skill.name}
          <span className={styles.charges}>{skill.held} Charges</span>
        </button>
      ))}
    </div>
  );
}
