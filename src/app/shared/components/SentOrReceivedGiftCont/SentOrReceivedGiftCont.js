import React, { useMemo } from "react";

import "./SentOrReceivedGiftCont.css";
const SentOrReceivedGiftCont = ({ gifts, isSent, redeemGift }) => {
  const giftInfo = useMemo(
    () =>
      gifts.map(gift => {
        return (
          <div className="cls_giftInfoCont" key={gift.id}>
            <div className="cls_giftInfo">{gift.giftName}</div>
            <div className="cls_giftInfo">
              {isSent ? gift.receiverEmail : gift.senderEmail}
            </div>
            {!isSent ? (
              <div className="cls_giftInfo">
                {!gift.redemed ? (
                  <button
                    className="btn"
                    onClick={() => redeemGift(gift.id)}
                    name="redeem button"
                  >
                    Redeme
                  </button>
                ) : (
                  <div className="cls_redeemedText">Redeemed</div>
                )}
              </div>
            ) : null}
          </div>
        );
      }),
    [gifts]
  );
  return gifts.length ? (
    giftInfo
  ) : (
    <div className="cls_noDataMsg">No gifts available in the list.</div>
  );
};

export default React.memo(SentOrReceivedGiftCont);
