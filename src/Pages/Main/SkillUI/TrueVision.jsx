import styles from "./TrueVision.module.css";

export default function TrueVision({ cards, hidden }) {
  const sum = cards.reduce((a, b) => a + b, 0);

  return <>{!hidden && <div className={styles.TrueVisionRoot}>{sum}</div>}</>;
}
