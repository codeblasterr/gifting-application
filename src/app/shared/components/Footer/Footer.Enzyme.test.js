import React from "react";
import Footer from "./Footer";
import { shallow } from "enzyme";

const renderFooter = () => {
  return shallow(<Footer />);
};
it("Renders Footer", () => {
  const wrapper = renderFooter();
  expect(wrapper.find("h5").length).toBe(1);
  expect(wrapper.find("h5").text()).toBe("Copyright Mindtree 2019-2025");
});
