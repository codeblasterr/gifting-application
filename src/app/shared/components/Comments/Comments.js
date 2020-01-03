import React, { useMemo } from "react";

import Comment from "./../Comment/Comment";

const Comments = ({ comments }) => {
  const commentList = useMemo(() => {
    return comments;
  }, [comments]);
  return (
    <div className="cls_commentList">
      {commentList.map(comment => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
};

export default React.memo(Comments);
