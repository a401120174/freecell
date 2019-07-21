import React from "react";
import Styles from "./Card.module.scss";

export const Card = ({ onDragStart, content, rowIdx, draggable, area }) => {
  const textMap = {
    spade: "黑桃",
    heart: "愛心",
    diamond: "方塊",
    club: "梅花"
  };

  return (
    <div
      className={`${Styles.card} ${draggable ? Styles.canDrag : ""}`}
      draggable={draggable}
      onDragStart={e => {
        if (!draggable) return false;
        onDragStart(e, content, rowIdx, area);
      }}
      id={content.number}
    >
      <img
        src={require(`../../static/${textMap[content.color]}${
          content.number
        }.png`)}
        draggable={false}
      />
    </div>
  );
};
