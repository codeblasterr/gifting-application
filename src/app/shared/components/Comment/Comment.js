import React from "react";

import "./Comment.css";

const Comment = ({ comment }) => {
  return (
    <div className="cls_comment">
      <div className="cls_ratingCont">
        <div className="cls_userName">{comment.userName}</div>
        <div className="cls_rating">Rating: {comment.rating}</div>
      </div>
      <div className="cls_review">{comment.review}</div>
    </div>
  );
};

export default React.memo(Comment);
