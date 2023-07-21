import styles from "./ActionBar.module.css";

export default function ActionBar({
  ActionCombatState,
  handleOnRollAttackClick,
  handleOnActionBarSelectionClick,
}) {
  return (
    <>
      {ActionCombatState ? (
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
      ) : (
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
