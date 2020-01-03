import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};
Modal.setAppElement("#root");
const ModalComponent = props => {
  return (
    <Modal
      isOpen={props.isOpen}
      style={customStyles}
      contentLabel={props.contentLabel}
    >
      {props.children}
    </Modal>
  );
};

export default React.memo(ModalComponent);
