import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import styles from "./Enemy.module.css";

const Enemy = forwardRef((props, ref) => {
  const { onEnemyDeath, enemyOnTakeDamage } = props;
  const [enemyMaxHealth, setEnemyMaxHealth] = useState(9999999);
  const [enemyCurrentHealth, setEnemyCurrentHealth] = useState(enemyMaxHealth);
  const [damageInfo, setDamageInfo] = useState(null);
  const damageCompRef = useRef(null);
  const nameRef = useRef("MISSINGNO."); // :)
  const imageRef = useRef("");

  useImperativeHandle(ref, () => ({
    setEnemy(image, name, maxHealth) {
      console.log("hello");
      imageRef.current = image;
      nameRef.current = name;
      setEnemyMaxHealth(maxHealth);
      setEnemyCurrentHealth(maxHealth);
    },

    takeDamage(damage) {
      setDamageInfo([
        damage,
        {
          top: `${Math.random() * 20 + 35}%`,
          left: `${Math.random() * 15 + 42.5}%`,
        },
      ]);
      setEnemyCurrentHealth((prev) => {
        let newHP = prev - damage;
        if (newHP <= 0) {
          setTimeout(() => {
            onEnemyDeath();
          }, 1000);
        } else {
          enemyOnTakeDamage();
        }
        return newHP;
      });
      setTimeout(() => {
        setDamageInfo(null);
      }, 500);
    },
  }));

  return (
    <>
      <img
        src={imageRef.current}
        className={`${styles.enemyImage} ${
          enemyCurrentHealth <= 0 ? styles.deathAnim : ""
        }`}
      ></img>

      <div className={styles.topBarContainer}>
        <p className={styles.enemyName}>{nameRef.current}</p>
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

      {damageInfo && (
        <div className={styles.damageCont} style={damageInfo[1]}>
          {damageInfo[0]}
        </div>
      )}
    </>
  );
});

export default Enemy;
