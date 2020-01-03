import React, {
  useEffect,
  Fragment,
  useMemo,
  useContext,
  useState,
  useCallback
} from "react";
import { useParams } from "react-router";

import ProductCard from "./../../shared/components/ProductCard/ProductCard";
import ModalComponent from "./../../shared/components/ModalComponent/ModalComponent";
import SendGift from "./../../shared/components/SendGift/SendGift";
import {
  GET_CARD_LIST,
  FILTTER_CARD_LIST
} from "./../../shared/utilities/AppReducer";
import {
  getGiftsList,
  getSearchParams,
  getBrandList,
  updateUser
} from "./../../shared/utilities/utils";
import { RESPONSE_MODAL_OPEN } from "./../../shared/utilities/AppReducer";
import { AppStateContext, AppDispatchContext } from "./../../../App";

import "./ListPage.css";

const ListPage = props => {
  const [sendGiftData, setSendGiftData] = useState({
    isOpen: false,
    giftInfo: {}
  });
  const appStateContext = useContext(AppStateContext);
  const appDispatchContext = useContext(AppDispatchContext);
  const memoizedAppDispatch = useMemo(() => appDispatchContext.dispatch, [
    appDispatchContext.dispatch
  ]);
  const ratings = [1, 2, 3, 4];
  const params = useParams();
  const param = getSearchParams(props.location.search);
  const categoryId = useMemo(() => {
    return param.categoryId;
  }, [param.categoryId]);
  const brands = appStateContext.brands.map(brand => {
    return (
      <Fragment key={brand}>
        <input
          key={brand}
          type="radio"
          onChange={elem => handleBrandFilter(brand, elem)}
          name="brandGroup"
          value={brand}
        />
        {brand}
        <br />
      </Fragment>
    );
  });
  useEffect(() => {
    (async () => {
      appDispatchContext.showSpinner();
      let gifts = await getGiftsList(param);
      let brandCategory = await getBrandList(param);
      let brands =
        brandCategory[0] && brandCategory[0].brand
          ? brandCategory[0].brand
          : [];
      appDispatchContext.dispatch({
        type: GET_CARD_LIST,
        payLoad: { gifts, brands }
      });
      appDispatchContext.hideSpinner();
    })();
  }, [categoryId]);

  const doClose = useCallback(() => {
    setSendGiftData({
      isOpen: false,
      giftInfo: {}
    });
  }, []);

  const doOpen = useCallback(gift => {
    setSendGiftData({
      isOpen: true,
      giftInfo: { ...gift }
    });
  }, []);

  const addToFavourite = async (gift, elem) => {
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
  };
  const removeFromFavourite = async (gift, elem) => {
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
  };
  const ratingFilter = ratings.map(rating => {
    return (
      <Fragment key={rating}>
        <input
          type="radio"
          name="ratingGroup"
          onChange={elem => handleRatingFilter(rating, elem)}
          value="4"
        />
        {rating} & Above
        <br />
      </Fragment>
    );
  });

  const handleBrandFilter = async (value, elem) => {
    (async () => {
      let isSelected = elem.target.checked;
      let newParam = { ...param };
      if (isSelected) newParam = { ...newParam, brand: value };
      let gifts = await getGiftsList(newParam);
      appDispatchContext.dispatch({ type: FILTTER_CARD_LIST, payLoad: gifts });
    })();
  };

  const handleRatingFilter = (rating, elem) => {
    (async () => {
      let isSelected = elem.target.checked;
      let newParam = { ...param };
      if (isSelected) newParam = { ...newParam, rating_gte: rating };
      let gifts = await getGiftsList(newParam);
      appDispatchContext.dispatch({ type: FILTTER_CARD_LIST, payLoad: gifts });
    })();
  };

  return (
    <>
      <div className="cls_title">
        <h3>{params.categoryName}</h3>
      </div>
      <div className="cls_listPageCont">
        <div className="cls_filterCont">
          {brands.length ? (
            <div className="cls_brandFilterCont">
              <div className="cls_filterHeading">Select Brand</div>
              <fieldset name="brandGroup">{brands}</fieldset>
            </div>
          ) : null}
          <div className="cls_ratingFilterCont">
            <div className="cls_filterHeading">Select Rating</div>
            <fieldset id="ratingGroup">{ratingFilter}</fieldset>
          </div>
        </div>
        <div className="cls_productsCont">
          {appStateContext.giftCards.map(card => (
            <ProductCard
              key={card.id}
              gift={card}
              addToFavourite={addToFavourite}
              removeFromFavourite={removeFromFavourite}
              doOpen={doOpen}
            />
          ))}
          {appStateContext.giftCards.length === 0 ? (
            <div className="cls_emptyMsg">No Product available.</div>
          ) : null}
        </div>
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
};

export default React.memo(ListPage);
