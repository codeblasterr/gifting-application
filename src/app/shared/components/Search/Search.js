import React from "react";
import Search from "@material-ui/icons/Search";

import "./Search.css";

const SearchField = props => {
  return (
    <div className="cls_searchBoxWrapper">
      <span>
        <Search />
      </span>
      <input
        type="text"
        placeholder="Search here..."
        name="search"
        onKeyUp={event => props.handleOnKeyUp(event)}
      />
    </div>
  );
};

export default React.memo(SearchField);
