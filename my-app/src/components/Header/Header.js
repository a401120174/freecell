import React, { useEffect } from "react";
import Styles from "./Header.module.scss";
import Logo from "../../static/logo.svg";
import Return from "../../static/btn-return.svg";
import More from "../../static/btn-more.svg";
import Gooto from "../../static/骨頭icon.svg";

export const Header = ({ time, score, onMoreClick, onBackClick }) => {
  const fomatedMin = Math.floor(time / 60);
  const fomatedsec = time % 60 >= 10 ? time % 60 : `0${time % 60}`;

  return (
    <div className={Styles.header}>
      <div>
        <img src={Logo} draggable={false} />
      </div>
      <div className={Styles.time}>
        <img src={More} onClick={onMoreClick} draggable={false} />
        Time:0{fomatedMin}:{fomatedsec}
        <img src={Return} onClick={onBackClick} draggable={false} />
      </div>
      <div>
        <img src={Gooto} draggable={false} />
        Score:{score}
      </div>
    </div>
  );
};
