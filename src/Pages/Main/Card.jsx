import React from "react";
import styles from "./Card.module.css";

export default function Card({ number, bAttack }) {
  return (
    <div
      className={styles.cardRoot}
      style={{
        width: bAttack ? "0vw" : "6.5vw",
        height: bAttack ? "0vw" : "6.5vw",
        transition: bAttack ? "width 0.5s ease-out, height 0.5s ease-out" : "none",
      }}
    >
      {!bAttack && number}
    </div>
  );
}
