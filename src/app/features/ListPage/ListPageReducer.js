export const GET_CARD_LIST = "GET_CARD_LIST";
export const LOAD_MORE_CARDS = "LOAD_MORE_CARDS";
export const FILTTER_CARD_LIST = "FILTTER_CARD_LIST";

export const initialState = {
  giftCards: [],
  rowHeight: 0,
  brands: []
};

export const listPageReducer = (state, action) => {
  switch (action.type) {
    case GET_CARD_LIST:
      return {
        ...state,
        brands: action.payLoad.brands,
        giftCards: action.payLoad.gifts
      };
    case LOAD_MORE_CARDS:
      return {
        ...state,
        giftCards: [...state.giftCards, ...action.payLoad.gifts]
      };
    case FILTTER_CARD_LIST:
      return {
        ...state,
        giftCards: action.payLoad
      };
    default:
      return state;
  }
};
