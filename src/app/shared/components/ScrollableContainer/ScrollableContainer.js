import React, {
  useEffect,
  useReducer,
  useContext,
  useMemo,
  lazy,
  Suspense,
  useState,
  useCallback
} from "react";
import { NavLink } from "react-router-dom";

import {
  listPageReducer,
  initialState,
  GET_CARD_LIST
} from "./ScrollableContainerReducer";
import { getGiftsList, updateUser } from "./../../utilities/utils";
import { RESPONSE_MODAL_OPEN } from "./../../utilities/AppReducer";
import { AppStateContext, AppDispatchContext } from "./../../../../App";

import "./ScrollableContainer.css";

const ProductCard = lazy(() => import("./../ProductCard/ProductCard"));
const ModalComponent = lazy(() => import("./../ModalComponent/ModalComponent"));
const SendGift = lazy(() => import("./../SendGift/SendGift"));

function ScrollableContainer(props) {
  const [sendGiftData, setSendGiftData] = useState({
    isOpen: false,
    giftInfo: {}
  });
  const appStateContext = useContext(AppStateContext);
  const appDispatchContext = useContext(AppDispatchContext);
  const memoizedAppDispatch = useMemo(() => appDispatchContext.dispatch, [
    appDispatchContext.dispatch
  ]);
  const [state, dispatch] = useReducer(listPageReducer, initialState);
  useEffect(() => {
    (async () => {
      const gifts = await getGiftsList(props);
      dispatch({ type: GET_CARD_LIST, payLoad: gifts });
    })();
  }, [props]);
  const doClose = useCallback(() => {
    setSendGiftData({
      isOpen: false,
      giftInfo: {}
    });
  }, []);

  const doOpen = useCallback(gift => {
    setSendGiftData({
      isOpen: true,
      giftInfo: { id: gift.id, name: gift.name }
    });
  }, []);
  const addToFavourite = useCallback(async (gift, elem) => {
    elem.stopPropagation();
    appDispatchContext.showSpinner();
    const userData = { ...appStateContext.userData };
    const { favorites } = userData;
    favorites.push(gift.id);
    const data = {
      userId: userData.id,
      payLoad: {
        ...userData,
        favorites
      }
    };
    const addFavouriteResp = await updateUser(data);
    if (addFavouriteResp.id) {
      memoizedAppDispatch({
        type: "UPDATE_USER_DATA",
        payLoad: addFavouriteResp
      });
      memoizedAppDispatch({
        type: RESPONSE_MODAL_OPEN,
        payLoad: {
          isOpen: true,
          message: "Product added to your favourite."
        }
      });
    }
    appDispatchContext.hideSpinner();
  }, []);
  const removeFromFavourite = useCallback(async (gift, elem) => {
    elem.stopPropagation();
    appDispatchContext.showSpinner();
    const userData = { ...appStateContext.userData };
    const { favorites } = userData;
    favorites.splice(favorites.indexOf(gift.id), 1);
    const data = {
      userId: userData.id,
      payLoad: {
        ...userData,
        favorites
      }
    };
    const removeResp = await updateUser(data);
    memoizedAppDispatch({
      type: "UPDATE_USER_DATA",
      payLoad: removeResp
    });
    memoizedAppDispatch({
      type: RESPONSE_MODAL_OPEN,
      payLoad: {
        isOpen: true,
        message: "Product removed from your favorite list."
      }
    });
    appDispatchContext.hideSpinner();
  }, []);
  return (
    <>
      <div className="cls_category">
        <div className="cls_categoryInfo cls_categoryText">
          {props.category}
        </div>
        <div className="cls_categoryInfo cls_viewAllCont">
          <NavLink
            to={`/gift-lists/${props.category}?categoryId=${props.categoryId}`}
          >
            View All
          </NavLink>
        </div>
      </div>
      <div className="cls_scrollCont">
        <Suspense fallback={<div>Loading...</div>}>
          {state.giftCards.map(product => (
            <ProductCard
              doOpen={() => doOpen({ ...product })}
              key={product.id}
              gift={{ ...product }}
              addToFavourite={addToFavourite}
              removeFromFavourite={removeFromFavourite}
            />
          ))}
        </Suspense>
      </div>
      <ModalComponent isOpen={sendGiftData.isOpen} contentLabel="Send Gift">
        <SendGift
          doClose={doClose}
          responseDispatcher={memoizedAppDispatch}
          giftInfo={sendGiftData.giftInfo}
          userInfo={{
            email: appStateContext.userData.email,
            userId: appStateContext.userId,
            name: appStateContext.userData.name
          }}
        />
      </ModalComponent>
    </>
  );
}

export default React.memo(ScrollableContainer);
