import React, {
  useEffect,
  Fragment,
  useMemo,
  useContext,
  useCallback,
  useReducer
} from "react";
import { useParams } from "react-router";
import { Grid } from "react-virtualized";

import ProductCard from "./../../shared/components/ProductCard/ProductCard";
import ModalComponent from "./../../shared/components/ModalComponent/ModalComponent";
import SendGift from "./../../shared/components/SendGift/SendGift";
import {
  GET_CARD_LIST,
  FILTTER_CARD_LIST
} from "./../../shared/utilities/AppReducer";
import {
  getSearchParams,
  getBrandList,
  updateUser,
  getGiftsListForInfiniteScroll,
  createUpdatedList,
  columnCount
} from "./../../shared/utilities/utils";
import { RESPONSE_MODAL_OPEN } from "./../../shared/utilities/AppReducer";
import { AppStateContext, AppDispatchContext } from "./../../../App";

import "./InfiniteLoadList.css";

const initialState = {
  sendGiftData: {
    isOpen: false,
    giftInfo: {}
  }
};

const infiniteLoaderReducer = (state, action) => {
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

const InfiniteLoadList = props => {
  const [state, dispatch] = useReducer(infiniteLoaderReducer, initialState);
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
      let brandCategory = [];
      let newParam = { ...param };
      let giftsNew = await getGiftsListForInfiniteScroll(newParam);
      let gifts = giftsNew.data;
      const updatedList = createUpdatedList(gifts);
      if (param.categoryId) brandCategory = await getBrandList(param);
      let brands =
        brandCategory[0] && brandCategory[0].brand
          ? brandCategory[0].brand
          : [];
      appDispatchContext.dispatch({
        type: GET_CARD_LIST,
        payLoad: { gifts, brands, updatedList }
      });
      appDispatchContext.hideSpinner();
    })();
  }, [categoryId]);

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
      let gifts = await getGiftsListForInfiniteScroll(newParam);
      const updatedList = createUpdatedList(gifts.data);
      appDispatchContext.dispatch({
        type: FILTTER_CARD_LIST,
        payLoad: { gifts, updatedList }
      });
    })();
  };

  const handleRatingFilter = (rating, elem) => {
    (async () => {
      let isSelected = elem.target.checked;
      let newParam = { ...param };
      if (isSelected) newParam = { ...newParam, rating_gte: rating };
      let gifts = await getGiftsListForInfiniteScroll(newParam);
      const updatedList = createUpdatedList(gifts.data);
      appDispatchContext.dispatch({
        type: FILTTER_CARD_LIST,
        payLoad: { gifts, updatedList }
      });
    })();
  };
  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    if (appStateContext.updatedList.length) {
      const card = appStateContext.updatedList[rowIndex][columnIndex];
      if (card) {
        return (
          <div className="cls_gridElemWrapper" style={style} key={key}>
            <ProductCard
              key={key}
              gift={card}
              addToFavourite={addToFavourite}
              removeFromFavourite={removeFromFavourite}
              doOpen={() => doOpen(card)}
            />
          </div>
        );
      }
    }
    return null;
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
          {appStateContext.updatedList.length === 0 ? (
            <div className="cls_emptyMsg">No Product available.</div>
          ) : (
            <Grid
              cellRenderer={cellRenderer}
              columnCount={columnCount}
              columnWidth={270}
              height={800}
              rowCount={appStateContext.updatedList.length}
              rowHeight={440}
              width={800}
            />
          )}
        </div>
      </div>
      <ModalComponent
        isOpen={state.sendGiftData.isOpen}
        contentLabel="Send Gift"
      >
        <SendGift
          doClose={doClose}
          responseDispatcher={memoizedAppDispatch}
          giftInfo={state.sendGiftData.giftInfo}
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

export default React.memo(InfiniteLoadList);
