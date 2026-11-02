import { useState, useEffect } from "react";
import Grid from "./components/Grid";
import AboutModal from "./components/AboutModal";
import { getAnswer, getHexleNumber } from "./answers";
import "./App.css";
import FinishModal from "./components/FinishModal";
import { GridData } from "./utils/types";
import myGa from "./myGA";

function App() {
  useEffect(() => {
    myGa();
  }, []);

  const todaysNumber = getHexleNumber(new Date());
  const dayKey = todaysNumber;

  // Ending state of the grid, used in FinishModal for clipboard purposes.
  const [endingGrid, setEndingGrid] = useState<null | GridData>();

  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  const [showAboutModal, setShowAboutModal] = useState(() => {
    // TODO: this still shows about modal every day. 
    // Make it so that it only ever shows on the user's first visit.
    return !localStorage.getItem(dayKey.toString())
  });

  const hexOfDay = getAnswer(new Date());

  const handleWin = (gridData: GridData) => {
    setWin(true);
    setEndingGrid(gridData);
  };

  const handleLose = (gridData: GridData) => {
    setLose(true);
    setEndingGrid(gridData);
  };

  return (
    <div className="main">
      <div>
        <h1
          className="title"
          onClick={() => setShowAboutModal(true)}
          style={{ color: "#" + hexOfDay }}
        >
          #Hexle
        </h1>
      </div>
      <p>
        Guess the colour of{" "}
        <span style={{ color: "#" + hexOfDay }}>#Hexle</span> in 6 tries! New
        colour daily.
      </p>
      <Grid
        hexOfDay={hexOfDay}
        handleWin={(gridData) => handleWin(gridData)}
        handleLose={(gridData) => handleLose(gridData)}
        dayKey={dayKey.toString()}
        win={win}
      />
      <FinishModal
        win={win}
        lose={lose}
        endingGrid={endingGrid || []}
        hexleNumber={todaysNumber}
        hexOfDay={hexOfDay}
      />
      <AboutModal
        showAboutModal={!win && !lose && showAboutModal}
        handleCloseAbout={() => setShowAboutModal(false)}
      />
    </div>
  );
}

export default App;
