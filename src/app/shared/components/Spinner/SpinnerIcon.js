import React from "react";

const SpinnerIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        margin: "auto",
        background: "none",
        display: "block",
        shapeRendering: "auto"
      }}
      width={"197px"}
      height={"197px"}
      viewBox={"0 0 100 100"}
      preserveAspectRatio={"xMidYMid"}
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#93dbe9"
        strokeWidth="4"
        r="15"
        strokeDasharray="70.68583470577033 25.561944901923447"
        transform="rotate(15.1415 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.36986301369863s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        ></animateTransform>
      </circle>
    </svg>
  );
};

export default React.memo(SpinnerIcon);
