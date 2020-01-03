import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";

import "./Navigation.css";

const Navigation = props => {
  const categoryList = useMemo(
    () =>
      props.categories.map(category => (
        <li key={category.id}>
          <NavLink
            to={`/gift-lists/${category.name}?categoryId=${category.id}`}
            activeClassName="cls_activeCategory"
          >
            <div className="cls_menuItem">{category.name}</div>
          </NavLink>
        </li>
      )),
    [props.categories]
  );
  return (
    <div className="container">
      <nav>
        <ul>{categoryList}</ul>
      </nav>
    </div>
  );
};

export default React.memo(Navigation);
