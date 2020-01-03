import React from "react";
import ProductCard from "./ProductCard";
import { shallow } from "enzyme";

import giftCards from "../../../../../tools/Data/GiftCardMockData";

const renderProductCard = props => {
  const defaultProps = {
    gift: {},
    doOpen: jest.fn(),
    appStateContext: {
      userData: {
        favorites: []
      }
    }
  };
  const param = { ...defaultProps, ...props };
  return shallow(<ProductCard {...param} />);
};
it("Renders Footer", () => {
  const wrapper = renderProductCard({ gift: giftCards[0] });
  expect(wrapper.find("img").length).toBe(1);
});

////Showing error on dispatcher. Need to check.
