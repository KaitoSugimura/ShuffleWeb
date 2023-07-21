import styles from "./LazyModel.module.css";

// Super bad code for a modal

export default function LazyModel({ children, setShowModal, style }) {
  return (
    <div className={styles.LazyModalRoot}>
      <div
      className={styles.LazyModalBack}
        onClick={() => {
          setShowModal(false);
        }}
      ></div>
      <div className={styles.LazyModal} style={style}>
        <div
          className={styles.closeButton}
          onClick={() => {
            setShowModal(false);
          }}
        >
          X
        </div>
        {children}
      </div>
    </div>
  );
}
