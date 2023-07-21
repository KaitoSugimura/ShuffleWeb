import { createContext, useContext, useState } from "react";
import { SoundContext } from "./Context/SoundContext";

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
  const { playMusic } = useContext(SoundContext);
  const [gameState, setGameStateVar] = useState("title");

  const setGameState = (newGameState) => {
    if (newGameState === "main") {
      playMusic("stage1");
    } else {
      playMusic(newGameState);
    }
    setGameStateVar(newGameState);
  };

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};
