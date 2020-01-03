import React, {
  useReducer,
  useEffect,
  createContext,
  useCallback,
  useMemo,
  lazy,
  Suspense
} from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "./app/shared/components/Header/Header";
import Footer from "./app/shared/components/Footer/Footer";
import Routers from "./app/routers/Routers";
import useSpinner from "./app/shared/components/Spinner/useSpinner";

import {
  getCategories,
  doLoginAfterRefresh
} from "./../src/app/shared/utilities/utils";
import {
  initialState,
  appReducer,
  GET_CATEGORIES,
  RESPONSE_MODAL_CLOSE
} from "./app/shared/utilities/AppReducer";

import "./App.css";

const ModalComponent = lazy(() =>
  import("./app/shared/components/ModalComponent/ModalComponent")
);
const ResponsePopup = lazy(() =>
  import("./app/shared/components/ResponsePopup/ResponsePopup")
);
const ErrorBoundary = lazy(() =>
  import("./app/shared/components/ErrorBoundaries/ErrorBoundaries")
);

export const AppStateContext = createContext({});
export const AppDispatchContext = createContext();

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [spinner, showSpinner, hideSpinner] = useSpinner();
  const modelState = useMemo(() => state.responseModel, [state.responseModel]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    (async () => {
      showSpinner();
      const fetchedCategories = await getCategories();
      dispatch({
        type: GET_CATEGORIES,
        payLoad: fetchedCategories
      });
      hideSpinner();
      doLoginAfterRefresh(dispatch);
    })();
  }, []);
  const doResponseClose = useCallback(() => {
    dispatch({ type: RESPONSE_MODAL_CLOSE });
  }, []);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppStateContext.Provider value={state}>
        <AppDispatchContext.Provider
          value={{ dispatch, showSpinner, hideSpinner }}
        >
          <Router>
            <div className="App">
              <Header />
              <div id="id_mainCont" className="container">
                <main>
                  <ErrorBoundary>
                    <Routers />
                  </ErrorBoundary>
                </main>
              </div>
              <Footer />
              {spinner}
              <ModalComponent
                isOpen={modelState.isOpen}
                contentLabel="Response"
              >
                <ResponsePopup
                  doClose={doResponseClose}
                  message={modelState.message}
                />
              </ModalComponent>
            </div>
          </Router>
        </AppDispatchContext.Provider>
      </AppStateContext.Provider>
    </Suspense>
  );
}

export default App;
