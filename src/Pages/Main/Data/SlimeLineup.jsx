import slime1 from "/Enemies/defaultSlime.gif";
import slime2 from "/Enemies/IceSlime.gif";
import slime3 from "/Enemies/FireSlime.gif";
import slime4 from "/Enemies/ArmoredSlime.gif";

export default [
  {name: "Normal Slime", health: 100, image: slime1, reward: 100},
  {name: "Water Slime", health: 250, image: slime2, reward: 200},
  {name: "Fire Slime", health: 1000, image: slime3, reward: 250},
  {name: "Boss Slime", health: 5000, image: slime4, reward: 1000},
]