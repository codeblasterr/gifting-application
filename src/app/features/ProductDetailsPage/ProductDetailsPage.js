import React, { useEffect, useContext, useState, useCallback } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import Edit from "@material-ui/icons/Edit";

import ModalComponent from "./../../shared/components/ModalComponent/ModalComponent";
import SendGift from "./../../shared/components/SendGift/SendGift";
import Comments from "./../../shared/components/Comments/Comments";
import {
  getGiftById,
  updateUser,
  getCommentsByGiftId,
  getUserDetails
} from "./../../shared/utilities/utils";
import { RESPONSE_MODAL_OPEN } from "./../../shared/utilities/AppReducer";
import { AppStateContext, AppDispatchContext } from "./../../../App";

import "./ProductDetailsPage.css";

function ProdctDetailsPage() {
  const [isOpen, setOpenModal] = useState(false);
  const [gift, setGift] = useState({});
  const [comments, setComments] = useState([]);
  const appState = useContext(AppStateContext);
  const appDispatcher = useContext(AppDispatchContext);
  const userFavourites = appState.userData.favorites;
  const { isLoggedIn, isSuperAdmin } = appState;
  const params = useParams();
  const { name, imageUrl, buyoutPoints, discount, id, rating } = gift;
  const userInfo = getUserDetails();
  const { productId } = params;
  useEffect(() => {
    (async () => {
      appDispatcher.showSpinner();
      const resp = await getGiftById(productId);
      const commentsResp = await getCommentsByGiftId(productId);
      setComments(commentsResp);
      setGift(resp);
      appDispatcher.hideSpinner();
    })();
  }, [productId]);
  const renderSendGiftModal = () => {
    setOpenModal(true);
  };
  const doClose = useCallback(() => {
    setOpenModal(false);
  }, []);
  const addToFavourite = async gift => {
    appDispatcher.showSpinner();
    const userData = { ...appState.userData };
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
      appDispatcher.dispatch({
        type: "UPDATE_USER_DATA",
        payLoad: addFavouriteResp
      });
      appDispatcher.dispatch({
        type: RESPONSE_MODAL_OPEN,
        payLoad: {
          isOpen: true,
          message: "Product added to your favourite."
        }
      });
    }
    appDispatcher.hideSpinner();
  };
  const removeFromFavourite = async gift => {
    appDispatcher.showSpinner();
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
    appDispatcher.dispatch({
      type: "UPDATE_USER_DATA",
      payLoad: removeResp
    });
    appDispatcher.dispatch({
      type: RESPONSE_MODAL_OPEN,
      payLoad: {
        isOpen: true,
        message: "Product removed from your favorite list."
      }
    });
    appDispatcher.hideSpinner();
  };
  return (
    <>
      <div className="cls_giftDetailsCont">
        {isSuperAdmin ? (
          <div className="cls_adminActionCont">
            <div className="cls_productEdit">
              <NavLink to={`/dashboard?productId=${productId}`}>
                <Edit />
              </NavLink>
            </div>
          </div>
        ) : null}
        <h1>{gift.name}</h1>
        <div className="cls_giftDetais">
          <div className="cls_imgBtnCont">
            <div className="cls_giftImg">
              <img src={imageUrl} alt={name} />
            </div>
            {isLoggedIn && !isSuperAdmin ? (
              <div className="cls_buttonCont">
                <div
                  className="btn"
                  productid={id}
                  onClick={renderSendGiftModal}
                >
                  Gift
                </div>
                {typeof userFavourites !== "undefined" &&
                !userFavourites.includes(id) ? (
                  <div
                    className="btn"
                    productid={id}
                    onClick={() => addToFavourite(gift)}
                  >
                    Favourite
                  </div>
                ) : (
                  <div
                    className="btn"
                    productid={id}
                    onClick={() => removeFromFavourite(gift)}
                  >
                    Remove Favourite
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <div className="cls_giftDescriptionCont">
            <div className="cls_infoCont">
              <div className="cls_pointsCont">
                <div className="cls_regPoints">
                  Reg Points: <span>{buyoutPoints}pts</span>
                </div>
                <div className="cls_actualPoints">
                  Buy on: <span>{buyoutPoints - discount}pts</span>
                </div>
              </div>
              {rating ? (
                <div className="cls_ratingCont">Rating: {rating}</div>
              ) : (
                ""
              )}
            </div>
            <h3>Description</h3>
            <div className="cls_giftDescCont">
              <div className="cls_giftDesc">{gift.desc}</div>
            </div>
          </div>
        </div>
      </div>
      {comments.length ? (
        <>
          <div className="cls_commentsHeader">
            <h3>Reviews & Comments</h3>
          </div>
          <div className="cls_commentsCont">
            <Comments comments={comments} />
          </div>
        </>
      ) : null}
      <ModalComponent isOpen={isOpen} contentLabel="Send Gift">
        <SendGift
          doClose={doClose}
          responseDispatcher={appDispatcher.dispatch}
          giftInfo={{ ...gift }}
          userInfo={{
            email: userInfo.email,
            userId: appState.userId,
            name: userInfo.name
          }}
        />
      </ModalComponent>
    </>
  );
}

export default React.memo(ProdctDetailsPage);
