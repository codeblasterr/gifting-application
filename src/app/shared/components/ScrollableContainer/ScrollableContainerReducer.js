export const GET_CARD_LIST = "GET_CARD_LIST";

export const initialState = {
  giftCards: []
};

export const listPageReducer = (state, action) => {
  switch (action.type) {
    case GET_CARD_LIST:
      return {
        ...state,
        giftCards: action.payLoad
      };
    default:
      return state;
  }
};
