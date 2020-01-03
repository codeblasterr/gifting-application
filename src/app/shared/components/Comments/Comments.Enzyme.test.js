import React from "react";
import Comments from "./Comments";
import { mount } from "enzyme";

import commentReviews from "../../../../../tools/Data/CommentsReviews";

const renderComment = props => {
  const defaultProps = {
    comments: []
  };
  const prop = { ...defaultProps, ...props };
  return mount(<Comments {...prop} />);
};
it("Renders Comments", () => {
  const wrapper = renderComment({ comments: commentReviews });
  expect(wrapper.find(".cls_userName").length).toBe(8);
  expect(wrapper.find(".cls_rating").length).toBe(8);
  expect(wrapper.find(".cls_review").length).toBe(8);
});
