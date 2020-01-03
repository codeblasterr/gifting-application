import React from "react";
import Comment from "./Comment";
import { shallow } from "enzyme";

import commentReviews from "../../../../../tools/Data/CommentsReviews";

const renderComment = props => {
  const defaultProps = {
    comment: {}
  };
  const prop = { ...defaultProps, ...props };
  return shallow(<Comment {...prop} />);
};
it("Renders Comment", () => {
  const wrapper = renderComment({ comment: commentReviews[0] });
  expect(wrapper.find(".cls_userName").text()).toBe("Lingaraju K");
  expect(wrapper.find(".cls_rating").text()).toBe("Rating: 5");
  expect(wrapper.find(".cls_review").text()).toBe("Awesome !!!");
});
