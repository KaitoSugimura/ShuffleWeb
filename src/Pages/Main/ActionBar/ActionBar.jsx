import styles from "./ActionBar.module.css";

export default function ActionBar({
  ActionCombatState,
  handleOnRollAttackClick,
  handleOnActionBarSelectionClick,
}) {
  return (
    <>
      {ActionCombatState === 1 && (
        <div className={styles.bottomCenter}>
          <button
            className={styles.selectionButton}
            onClick={(event) => {
              handleOnActionBarSelectionClick(event, 0);
            }}
          >
            Left
          </button>
          <button
            className={styles.selectionButton}
            onClick={(event) => {
              handleOnActionBarSelectionClick(event, 1);
            }}
          >
            Right
          </button>
        </div>
      )}
      {ActionCombatState === 0 && (
        <button
          className={`${styles.bottomCenter} ${styles.selectionButton}`}
          onClick={(event) => {
            handleOnRollAttackClick(event);
          }}
        >
          Roll Attack
        </button>
      )}
    </>
  );
}
