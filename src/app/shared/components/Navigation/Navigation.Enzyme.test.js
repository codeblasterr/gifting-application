import React from "react";
import Navigation from "./Navigation";
import { shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import categories from "./../../../../../tools/Data/Categories";

const renderNavigationShallow = props => {
  const defaultProps = {
    categories: []
  };
  const prop = { ...defaultProps, ...props };
  return shallow(<Navigation {...prop} />);
};
const renderNavigationMount = props => {
  const defaultProps = {
    categories: []
  };
  const prop = { ...defaultProps, ...props };
  return mount(
    <MemoryRouter>
      <Navigation {...prop} />
    </MemoryRouter>
  );
};
it("Renders All Navlink Shallow", () => {
  const wrapper = renderNavigationShallow({ categories: categories });
  expect(wrapper.find("NavLink").length).toBe(7);
});

it("Renders One Navlink Shallow", () => {
  const wrapper = renderNavigationShallow({ categories: [categories[2]] });
  expect(wrapper.find("NavLink").length).toBe(1);
  expect(wrapper.find("NavLink").text()).toBe("Fashion");
});

it("Renders All Navlink Mount", () => {
  const wrapper = renderNavigationMount({ categories: categories });
  expect(wrapper.find("a").length).toBe(7);
});

it("Renders One Navlink Mount", () => {
  const wrapper = renderNavigationMount({ categories: [categories[2]] });
  expect(wrapper.find("a").length).toBe(1);
  expect(wrapper.find("a").text()).toBe("Fashion");
});
