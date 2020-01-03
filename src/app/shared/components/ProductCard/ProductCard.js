import React, { useContext, useMemo } from "react";
import { useHistory, NavLink } from "react-router-dom";
import Edit from "@material-ui/icons/Edit";

import { AppStateContext, AppDispatchContext } from "./../../../../App";
import { RESPONSE_MODAL_OPEN } from "./../../utilities/AppReducer";

import "./ProductCard.css";

const ProductCard = props => {
  const appStateContext = useContext(AppStateContext);
  const appDispatchContext = useContext(AppDispatchContext);
  const { isLoggedIn, isSuperAdmin } = appStateContext;
  const userFavourites = useMemo(() => appStateContext.userData.favorites, [
    appStateContext.userData
  ]);
  let gift = useMemo(() => {
    return { ...props.gift };
  }, [props.gift]);
  const { name, imageUrl, buyoutPoints, discount, id, rating } = gift;
  const history = useHistory();
  const renderSendGiftModal = () => {
    if (appStateContext.userData.balancePoints >= buyoutPoints)
      props.doOpen({
        isOpen: true,
        gift: {
          id,
          name
        }
      });
    else {
      appDispatchContext.dispatch({
        type: RESPONSE_MODAL_OPEN,
        payLoad: {
          isOpen: true,
          message: "Sorry you don't have enough points to purchase this gift."
        }
      });
    }
  };
  const navigateToDetaislPage = id => {
    history.push(`/gift-card/${id}`);
  };
  return (
    <div className="cls_skProductCard">
      {isSuperAdmin ? (
        <div className="cls_adminActionCont">
          <div className="cls_productEdit">
            <NavLink to={`/dashboard?productId=${id}`}>
              <Edit />
            </NavLink>
          </div>
        </div>
      ) : null}
      <div className="cls_imageCont" onClick={() => navigateToDetaislPage(id)}>
        <img src={imageUrl} alt={name} />
      </div>
      <div className="cls_detailsCont">
        <div className="cls_nameCont">{name}</div>
        <div className="cls_pointsCont">
          <div className="cls_regPoints">
            Reg Points: <span>{buyoutPoints}pts</span>
          </div>
          <div className="cls_actualPoints">
            Buy on: <span>{buyoutPoints - discount}pts</span>
          </div>
        </div>
        {rating ? <div className="cls_ratingCont">Rating: {rating}</div> : ""}
        {!isSuperAdmin && isLoggedIn ? (
          <>
            <div className="cls_buttonCont">
              <div className="btn" productid={id} onClick={renderSendGiftModal}>
                Gift
              </div>
              {!userFavourites.includes(id) ? (
                <div
                  className="btn"
                  productid={id}
                  onClick={elem => props.addToFavourite(gift, elem)}
                >
                  Favourite
                </div>
              ) : (
                <div
                  className="btn"
                  productid={id}
                  onClick={elem => props.removeFromFavourite(gift, elem)}
                >
                  Remove Favorite
                </div>
              )}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
