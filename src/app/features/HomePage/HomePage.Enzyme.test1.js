import React from "react";
import { HomePage } from "./HomePage";
import { mount } from "enzyme";

import categories from "../../../../tools/Data/Categories";

const renderHomePage = props => {
  const defaultProps = { appState: { categories: [] } };
  const prop = { ...defaultProps, ...props };
  return mount(<HomePage {...prop} />);
};
it("Renders Banner", () => {
  const wrapper = renderHomePage({ appState: { categories: categories } });
  expect(wrapper.find("NavLink").length).toBe(7);
});
