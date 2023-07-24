import { useContext, useState } from "react";
import styles from "./Shop.module.css";
import ShopImage from "/Images/GoldBag.png";
import LazyModel from "../../../Tools/LazyModel";
import { MainContext } from "../Main";

export default function Shop({ SkillsList }) {
  const { currentGold, addGold } = useContext(MainContext);
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

      {showModel && (
        <LazyModel setShowModal={setShowModal}>
          <div className={styles.ShopCont}>
            <h1 >Shop</h1>
            <div className={styles.ShopItems}>
              {SkillsList.map((skill, index) => (
                <button
                  className={styles.BuySkillbutton}
                  onClick={() => {
                    if (currentGold >= skill.cost) {
                      skill.buy();
                      addGold(-skill.cost);
                    }
                  }}
                  key={index}
                >
                  <h2>{skill.name}</h2><p className={styles.Description}>{skill.description}</p><p className={styles.goldAmount}>{skill.cost} Gold</p>
                </button>
              ))}
            </div>
          </div>
        </LazyModel>
      )}
    </div>
  );
}
