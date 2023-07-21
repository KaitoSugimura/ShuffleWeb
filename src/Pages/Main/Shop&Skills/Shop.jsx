import { useState } from "react";
import styles from "./Shop.module.css";
import ShopImage from "/Images/GoldBag.png";
import LazyModel from "../../../Tools/LazyModel";

export default function Shop() {
  const [showModel, setShowModal] = useState(false);

  return (
    <div className={styles.ShopRoot}>
      <button
        className={styles.ShopButton}
        onClick={() => {
          setShowModal(true);
        }}
      >
        <img src={ShopImage} className={styles.ShopImage}></img>
      </button>

      {showModel && <LazyModel setShowModal={setShowModal}>
        <div>
          <div></div>
        </div>
        </LazyModel>}
    </div>
  );
}
