import React from "react";

import Logo from "./../../../../images/banner.jpg";
import "./Banner.css";

const Banner = props => {
  return (
    <div className="cls_imgCot">
      <img src={props.logo ? props.logo : Logo} alt="Banners"></img>
    </div>
  );
};

export default React.memo(Banner);
