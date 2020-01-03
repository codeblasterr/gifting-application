import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useReducer,
  useCallback,
  useMemo
} from "react";

import { AppStateContext, AppDispatchContext } from "./../../../App";
import UserGift from "./../../shared/components/UserGifts/UserGifts";
import ProductCard from "./../../shared/components/ProductCard/ProductCard";
import ModalComponent from "./../../shared/components/ModalComponent/ModalComponent";
import SendGift from "./../../shared/components/SendGift/SendGift";
import {
  authLoginCheck,
  updateUser,
  getFavoriteList
} from "./../../shared/utilities/utils";
import { RESPONSE_MODAL_OPEN } from "./../../shared/utilities/AppReducer";

import "./ProfilePage.css";
import { useHistory } from "react-router";

const initialState = {
  sendGiftData: {
    isOpen: false,
    giftInfo: {}
  }
};

const profilePageReducer = (state, action) => {
  switch (action.type) {
    case "SEND_GIFT_MODAL":
      return {
        ...state,
        ...action.payLoad
      };
    default:
      return state;
  }
};

const ProfilePage = () => {
  const [state, dispatch] = useReducer(profilePageReducer, initialState);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [showAddPoints, setShowAddPoints] = useState(false);
  const appState = useContext(AppStateContext);
  const appDisPatch = useContext(AppDispatchContext);
  const history = useHistory();
  const userData = appState.userData;
  const { image, name, email, balancePoints } = userData;
  const pointsElem = useRef(balancePoints);
  const memoizedAppDispatch = useMemo(() => appDisPatch.dispatch, [
    appDisPatch.dispatch
  ]);
  useEffect(() => {
    authLoginCheck(appState.isLoggedIn, history);
    if (userData.favorites && userData.favorites.length) {
      (async () => {
        appDisPatch.showSpinner();
        const favoriteProductList = await getFavoriteList(userData.favorites);
        setFavoriteProducts(favoriteProductList);
        appDisPatch.hideSpinner();
      })();
    }
  }, [appState.userData]);

  const doClose = useCallback(() => {
    dispatch({
      type: "SEND_GIFT_MODAL",
      payLoad: {
        sendGiftData: {
          isOpen: false,
          giftInfo: {}
        }
      }
    });
  }, []);

  const doOpen = useCallback(gift => {
    dispatch({
      type: "SEND_GIFT_MODAL",
      payLoad: {
        sendGiftData: {
          isOpen: true,
          giftInfo: { ...gift }
        }
      }
    });
  }, []);

  const addPointsToUser = useCallback(async () => {
    appDisPatch.showSpinner();
    const data = {
      userId: userData.id,
      payLoad: {
        ...userData,
        balancePoints:
          userData.balancePoints + parseInt(pointsElem.current.value)
      }
    };
    const resp = await updateUser(data);
    if (resp.id) {
      setShowAddPoints(false);
      appDisPatch.dispatch({
        type: "UPDATE_USER_DATA",
        payLoad: resp
      });
      appDisPatch.dispatch({
        type: RESPONSE_MODAL_OPEN,
        payLoad: {
          isOpen: true,
          message: "Your points has been added successfully."
        }
      });
    }
    appDisPatch.hideSpinner();
  }, []);
  const removeFromFavourite = useCallback(async (gift, elem) => {
    elem.stopPropagation();
    appDisPatch.showSpinner();
    const userData = { ...appState.userData };
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
    appDisPatch.dispatch({
      type: "UPDATE_USER_DATA",
      payLoad: removeResp
    });
    appDisPatch.dispatch({
      type: RESPONSE_MODAL_OPEN,
      payLoad: {
        isOpen: true,
        message: "Product removed from your favorite list."
      }
    });
    appDisPatch.hideSpinner();
  }, []);
  const toggleAddPoints = useCallback(() => {
    setShowAddPoints(true);
  }, []);
  return (
    <>
      <h1>Profile</h1>
      <div className="cls_userProfileCont">
        <div className="cls_userImg">
          <img src={image} alt={name} />
        </div>
        <div className="cls_userDetailsCont">
          <div className="cls_userInfo cls_userName">Name: {name}</div>
          <div className="cls_userInfo cls_userEmail">Email: {email}</div>
          <div className="cls_userInfo cls_userPoints">
            <span>Points: {balancePoints}</span>

            <button className="cls_inpItem btn" onClick={toggleAddPoints}>
              Add Points
            </button>
          </div>
          {showAddPoints ? (
            <div className="cls_inputCont">
              <input
                className="cls_inpItem"
                type="text"
                defaultValue={0}
                ref={pointsElem}
              />
              <div className="cls_btnWrapper">
                <button className="cls_inpItem btn" onClick={addPointsToUser}>
                  Add
                </button>
                <button
                  className="cls_inpItem btn"
                  onClick={() => setShowAddPoints(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {favoriteProducts.length ? <h1>Favorites</h1> : null}
      {favoriteProducts.length ? (
        <div className="cls_favoriteCont">
          {favoriteProducts.map(product => {
            return (
              <ProductCard
                key={product.id}
                gift={product}
                removeFromFavourite={removeFromFavourite}
                doOpen={() => doOpen(product)}
              />
            );
          })}
        </div>
      ) : null}
      <UserGift />
      <ModalComponent
        isOpen={state.sendGiftData.isOpen}
        contentLabel="Send Gift"
      >
        <SendGift
          doClose={doClose}
          responseDispatcher={memoizedAppDispatch}
          giftInfo={state.sendGiftData.giftInfo}
          userInfo={{
            email: appState.userData.email,
            userId: appState.userId,
            name: appState.userData.name
          }}
        />
      </ModalComponent>
    </>
  );
};

export default React.memo(ProfilePage);
