// import { BrowserRouter } from "react-router-dom";
import { useContext } from "react";
import Main from "./Pages/Main/Main";
import { GameContext } from "./GameContext";
import Title from "./Pages/TitleScreen/Title";
import End from "./Pages/EndScreen/End";

function App() {
  const { gameState } = useContext(GameContext);

  const getComponent = () => {
    switch (gameState) {
      case "title":
        return <Title />;
      case "main":
        return <Main />;
      case "end":
        return <End />;
      default:
      // Create error screen
    }
  };

  return getComponent();
}

export default App;
