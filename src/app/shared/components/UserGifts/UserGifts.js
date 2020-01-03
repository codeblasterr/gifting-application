import React, { useEffect, useState, useContext, useCallback } from "react";

import { AppDispatchContext } from "./../../../../App";
import { updateUserGift } from "./../../utilities/utils";
import SentOrReceivedGiftCont from "./../SentOrReceivedGiftCont/SentOrReceivedGiftCont";
import { getUserGifts, getUserDetails } from "./../../utilities/utils";

import "./UserGifts.css";

const UserGift = () => {
  const [gifts, setGifts] = useState([]);
  const [isSent, setIsSent] = useState(false);
  const appDispatchContext = useContext(AppDispatchContext);
  const userInfo = getUserDetails();
  useEffect(() => {
    (async () => {
      const userGift = await getUserGifts({ receiverEmail: userInfo.email });
      setGifts(userGift);
    })();
  }, [userInfo.email]);

  const getSentGifts = useCallback(async () => {
    setIsSent(true);
    const userGift = await getUserGifts({ senderEmail: userInfo.email });
    setGifts(userGift);
  }, []);
  const getReceivedGifts = useCallback(async () => {
    setIsSent(false);
    const userGift = await getUserGifts({ receiverEmail: userInfo.email });
    setGifts(userGift);
  }, []);
  const redeemGift = useCallback(async id => {
    appDispatchContext.showSpinner();
    const redeemResp = await updateUserGift(id, { redemed: true });
    if (redeemResp.id) {
      const giftIndex = gifts.findIndex(gift => gift.id === redeemResp.id);
      const newGifts = [...gifts];
      newGifts[giftIndex].redemed = true;
      setGifts(newGifts);
    }
    appDispatchContext.hideSpinner();
  }, []);
  return (
    <div className="cls_userGiftCont">
      <h3>Gift Cards</h3>
      <div className="cls_buttonCont">
        <button
          className="btn cls_received"
          onClick={getReceivedGifts}
          name="received gifts button"
        >
          Received
        </button>
        <button
          className="btn cls_sent"
          onClick={getSentGifts}
          name="sent gifts button"
        >
          Sent
        </button>
      </div>

      <div className="cls_receivedGiftCont">
        <div className="cls_giftHeaderCont">
          <div className="cls_giftInfoHeader">Gift Name</div>
          <div className="cls_giftInfoHeader">
            {isSent ? "Receiver" : "Sender"}
          </div>
          {!isSent ? <div className="cls_giftInfoHeader"></div> : null}
        </div>
        <SentOrReceivedGiftCont
          gifts={gifts}
          isSent={isSent}
          redeemGift={redeemGift}
        />
      </div>
    </div>
  );
};

export default React.memo(UserGift);
