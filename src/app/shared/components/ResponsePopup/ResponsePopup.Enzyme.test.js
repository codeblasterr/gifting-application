import React from "react";
import ResponsePopup from "./ResponsePopup";
import { shallow } from "enzyme";

const renderResponsePopup = props => {
  const defaultProps = {
    message: ""
  };
  const prop = { ...defaultProps, ...props };
  return shallow(<ResponsePopup {...prop} />);
};
it("Renders Footer", () => {
  const wrapper = renderResponsePopup({ message: "Test" });
  expect(wrapper.find(".cls_responseMsg").length).toBe(1);
  expect(wrapper.find(".cls_responseMsg").text()).toBe("Test");
  expect(wrapper.find(".btn").length).toBe(1);
});
