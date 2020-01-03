import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router";

import { AppStateContext } from "./../../../App";
import AddGiftCard from "./../../shared/components/AddGiftCard/AddGiftCard";
import { authLoginCheck } from "./../../shared/utilities/utils";

const DashBoard = () => {
  const appState = useContext(AppStateContext);
  const history = useHistory();
  useEffect(() => authLoginCheck(appState.isLoggedIn, history), [
    appState.isLoggedIn
  ]);
  return <AddGiftCard />;
};

export default React.memo(DashBoard);
