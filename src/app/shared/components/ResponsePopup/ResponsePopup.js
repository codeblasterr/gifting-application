import React from "react";

import "./ResponsePopup.css";
const ResponsePopup = props => {
  return (
    <div className="cls_responseMsgCont">
      <div className="cls_responseMsg">{props.message}</div>
      <div className="cls_responseBtnCont">
        <button className="btn" onClick={props.doClose} name="Ok">
          OK
        </button>
      </div>
    </div>
  );
};

export default React.memo(ResponsePopup);
