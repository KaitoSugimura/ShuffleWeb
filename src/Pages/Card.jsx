import React from 'react'
import styles from "./Card.module.css";

export default function Card({number}) {
  return (
    <div className={styles.cardRoot}>
      {number}
    </div>
  )
}
