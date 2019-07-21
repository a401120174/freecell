import React, { useEffect } from "react";
import Styles from "./Modal.module.scss";
import Gooto from "../../static/骨頭icon.svg";
import Cancel from "../../static/icon-cancel.svg";

export const Modal = ({ title, content, bottom, onClose }) => {
  return (
    <div className={Styles.cover}>
      <div className={Styles.modal}>
        <div className={Styles.cancelBtn} onClick={onClose}>
          <img src={Cancel} />
        </div>
        {title && (
          <div className={Styles.title}>
            <img src={Gooto} />
            {title} <img src={Gooto} />
          </div>
        )}
        <div className={Styles.content}>{content}</div>
        {bottom && <div className={Styles.bottom}>{bottom}</div>}
      </div>
    </div>
  );
};
