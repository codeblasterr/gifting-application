import React, { useContext, useMemo } from "react";

import Banner from "./../../shared/components/Banner/Banner";
import ScrollableContainer from "./../../shared/components/ScrollableContainer/ScrollableContainer";

import { AppStateContext } from "./../../../App";

export function HomePage() {
  const appState = useContext(AppStateContext);
  const categories = useMemo(() => appState.categories, [appState.categories]);
  const scrollers = categories.map(category => (
    <ScrollableContainer
      key={category.id}
      categoryId={category.id}
      category={category.name}
      _limit={5}
    />
  ));
  return (
    <>
      <Banner />
      {scrollers}
    </>
  );
}

export default React.memo(HomePage);
