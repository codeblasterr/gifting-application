import React from "react";
import Banner from "./Banner";
import { shallow } from "enzyme";

import Logo from "./../../../../images/banner.jpg";

const renderBanner = props => {
  const defaultProps = {
    logo: ""
  };
  const prop = { ...defaultProps, ...props };
  return shallow(<Banner {...prop} />);
};
it("Renders Banner", () => {
  const wrapper = renderBanner({ logo: Logo });
  expect(wrapper.find(".cls_imgCot").length).toBe(1);
  expect(wrapper.find("img").length).toBe(1);
});
