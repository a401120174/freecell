import React, { useEffect, useState, useRef } from "react";
import Styles from "./App.module.scss";
import { Card } from "./components/Card/Card";
import { Header } from "./components/Header/Header";
import { Modal } from "./components/Modal/Modal";
import JQK from "./static/bg-JQK.svg";
import bgRight from "./static/bg-right.svg";
import bgLeft from "./static/bg-left.svg";

const initGameArea = [
  [
    { color: "spade", number: 8 },
    { color: "club", number: 10 },
    { color: "club", number: 5 },
    { color: "diamond", number: 2 },
    { color: "diamond", number: 8 },
    { color: "spade", number: 1 },
    { color: "diamond", number: 10 }
  ],
  [
    { color: "club", number: 9 },
    { color: "club", number: 6 },
    { color: "diamond", number: 11 },
    { color: "club", number: 1 },
    { color: "spade", number: 5 },
    { color: "club", number: 2 },
    { color: "spade", number: 6 }
  ],
  [
    { color: "heart", number: 1 },
    { color: "spade", number: 9 },
    { color: "spade", number: 12 },
    { color: "club", number: 8 },
    { color: "club", number: 11 },
    { color: "diamond", number: 12 },
    { color: "spade", number: 2 }
  ],
  [
    { color: "heart", number: 13 },
    { color: "diamond", number: 9 },
    { color: "heart", number: 12 },
    { color: "club", number: 12 },
    { color: "heart", number: 2 },
    { color: "spade", number: 3 },
    { color: "spade", number: 7 }
  ],
  [
    { color: "heart", number: 7 },
    { color: "heart", number: 5 },
    { color: "diamond", number: 5 },
    { color: "heart", number: 6 },
    { color: "heart", number: 9 },
    { color: "diamond", number: 1 }
  ],
  [
    { color: "club", number: 4 },
    { color: "diamond", number: 4 },
    { color: "club", number: 3 },
    { color: "heart", number: 4 },
    { color: "spade", number: 11 },
    { color: "spade", number: 10 }
  ],
  [
    { color: "heart", number: 8 },
    { color: "heart", number: 3 },
    { color: "spade", number: 4 },
    { color: "heart", number: 11 },
    { color: "diamond", number: 7 },
    { color: "spade", number: 13 }
  ],
  [
    { color: "club", number: 7 },
    { color: "diamond", number: 3 },
    { color: "diamond", number: 6 },
    { color: "diamond", number: 13 },
    { color: "spade", number: 13 },
    { color: "heart", number: 10 }
  ]
];
const initPendArea = [null, null, null, null];
const initDoneArea = [[], [], [], []];

const checkIsDropable = (existCard, newCard) => {
  const colorMap = {
    spade: "black",
    club: "black",
    diamond: "red",
    heart: "red"
  };
  const existCardColor = colorMap[existCard.color];
  const newCardColor = colorMap[newCard.color];
  const existCardNumber = existCard.number;
  const newCardNumber = newCard.number;

  if (existCardColor === newCardColor) return false;
  if (existCardNumber !== newCardNumber + 1) return false;
  return true;
};

const checkIsDone = (existCard, newCard) => {
  if (!existCard) return newCard.number === 1;
  return (
    newCard.number - 1 === existCard.number && newCard.color === existCard.color
  );
};

function App() {
  const [gameArea, setGame] = useState(initGameArea);
  const [pendArea, setPendArea] = useState(initPendArea);
  const [doneArea, setDoneArea] = useState(initDoneArea);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [modal, setModal] = useState("START");

  const refTime = useRef(time);
  const refTimeId = useRef();

  useEffect(() => {
    refTime.current = time;
  }, [time]);

  const onDragStart = (e, content, rowIdx) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ ...content, rowIdx })
    );
  };

  const onCardDrop = (e, dropRowIdx, type) => {
    e.preventDefault();
    const draggingCard = JSON.parse(e.dataTransfer.getData("text/plain"));
    const dragIndex = draggingCard.rowIdx;

    delete draggingCard.rowIdx;
    const newGameArea = [...gameArea];
    const fromAreaRow = [...newGameArea[dragIndex]];

    let existCard = "";
    switch (type) {
      case "PLAY":
        const toAreaRow = [...newGameArea[dropRowIdx]];
        existCard = toAreaRow[toAreaRow.length - 1];
        const isDropable = checkIsDropable(existCard, draggingCard);

        if (!isDropable) return false;

        toAreaRow.push(draggingCard);
        newGameArea[dropRowIdx] = toAreaRow;

        break;
      case "PEND":
        const newPendArea = [...pendArea];

        if (newPendArea[dropRowIdx]) return false;
        newPendArea[dropRowIdx] = draggingCard;

        setPendArea([...newPendArea]);
        break;
      case "DONE":
        const newDoneArea = [...doneArea];
        const newDoneAreaRow = [...newDoneArea[dropRowIdx]];
        existCard = newDoneAreaRow[newDoneAreaRow.length - 1];

        if (!checkIsDone(existCard, draggingCard)) return false;
        newDoneAreaRow.push(draggingCard);
        newDoneArea[dropRowIdx] = newDoneAreaRow;
        setDoneArea([...newDoneArea]);
        setScore(score + 100);
        break;
      default:
        break;
    }

    fromAreaRow.pop();
    newGameArea[dragIndex] = fromAreaRow;
    setGame([...newGameArea]);
  };

  function cancelDefault(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  const startGame = () => {
    setModal(null);
    refTimeId.current = setInterval(() => {
      setTime(refTime.current + 1);
    }, 1000);
  };

  const onMoreClick = () => {
    clearInterval(refTimeId.current);
    setModal("OPTION");
  };

  const onBackClick = () => {};

  const renderMoadl = () => {
    let title = null;
    let content = null;
    let bottom = null;

    switch (modal) {
      case "START":
        title = "How To Play";
        bottom = <div onClick={startGame}>GO!</div>;
        content = (
          <div>
            <p>
              Freecell is a one-deck solitaire card game. All cards are dealt
              into 8 tableau piles. Four Cells (in the top left corner of the
              screen) and four foundation piles (top right hand corner) are
              placed above the tableau piles.
            </p>
            <p>
              The object of the game is to build up all cards on foundations
              from Ace to King by following suit. You win when all 52 cards are
              moved there, 13 to a pile. Top cards of tableau piles and cards
              from Cells are available to play.
            </p>
            <p>
              You can build tableau piles down by alternating color. Only one
              card at a time can be moved. The top card of any tableau pile can
              also be moved to any Cell. Each Cell (or Reserve space) may
              contain only one card. Cards in the cells can be moved to the
              foundation piles or back to the tableau piles, if possible. The
              rules state that you can move only one card at a time, but you can
              move group of cards in the proper sequence if you have enough free
              (empty) Cells and/or tableau piles.
            </p>
          </div>
        );
        break;
      case "OPTION":
        title = "Pause";
        content = (
          <React.Fragment>
            <div className={Styles.option}>Start a New Game</div>
            <div className={Styles.option} onClick={startGame}>
              Keep Playing
            </div>
          </React.Fragment>
        );
        break;
      default:
        break;
    }

    return (
      <Modal
        title={title}
        content={content}
        bottom={bottom}
        onClose={startGame}
      />
    );
  };

  return (
    <div className={Styles.app}>
      <Header
        time={time}
        score={score}
        onMoreClick={onMoreClick}
        onBackClick={onBackClick}
      />
      {modal && renderMoadl()}
      <div className={Styles.topArea}>
        <div className={Styles.pendArea}>
          {pendArea.map((card, rowIdx) => (
            <div
              className={Styles.cardBox}
              onDrop={e => {
                onCardDrop(e, rowIdx, "PEND");
              }}
              onDragEnter={cancelDefault}
              onDragOver={cancelDefault}
            >
              {card && (
                <Card
                  content={card}
                  onDragStart={onDragStart}
                  rowIdx={rowIdx}
                  draggable={true}
                  area="PEND"
                />
              )}
            </div>
          ))}
        </div>
        <div className={Styles.playArea}>
          {doneArea.map((cardBox, rowIdx) => (
            <div
              className={Styles.cardBox}
              onDrop={e => {
                onCardDrop(e, rowIdx, "DONE");
              }}
              onDragEnter={cancelDefault}
              onDragOver={cancelDefault}
            >
              {cardBox.length > 0 &&
                cardBox.map((card, idx) => (
                  <Card
                    content={card}
                    onDragStart={onDragStart}
                    rowIdx={rowIdx}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className={Styles.playArea}>
        {gameArea.map((cardBox, rowIdx) => (
          <div
            className={Styles.cardBox}
            onDrop={e => {
              onCardDrop(e, rowIdx, "PLAY");
            }}
            onDragEnter={cancelDefault}
            onDragOver={cancelDefault}
          >
            {cardBox.length > 0 &&
              cardBox.map((card, idx) => (
                <Card
                  content={card}
                  onDragStart={onDragStart}
                  rowIdx={rowIdx}
                  draggable={idx === cardBox.length - 1}
                  area="PLAY"
                />
              ))}
          </div>
        ))}
      </div>

      <div className={Styles.bottomBg}>
        <img src={bgLeft} draggable={false} />
        <img src={JQK} className={Styles.center} draggable={false} />
        <img src={bgRight} draggable={false} />
      </div>
    </div>
  );
}

export default App;
