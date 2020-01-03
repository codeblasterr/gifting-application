export const GET_CATEGORIES = "GET_CATEGORIES";
export const LOGGED_IN = "LOGGED_IN";
export const LOGGED_OUT = "LOGGED_OUT";
export const UPDATE_USER_DATA = "UPDATE_USER_DATA";
export const RESPONSE_MODAL_CLOSE = "RESPONSE_MODAL_CLOSE";
export const RESPONSE_MODAL_OPEN = "RESPONSE_MODAL_OPEN";
export const GET_CARD_LIST = "GET_CARD_LIST";
export const LOAD_MORE_CARDS = "LOAD_MORE_CARDS";
export const FILTTER_CARD_LIST = "FILTTER_CARD_LIST";
export const UPDATE_SCROLL_DATA = "UPDATE_SCROLL_DATA";

export const initialState = {
  categories: [],
  isLoggedIn: false,
  isSuperAdmin: false,
  userId: 0,
  userData: {},
  isLoading: true,
  responseModel: { isOpen: false, message: "" },
  giftCards: [],
  brands: [],
  updatedList: []
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payLoad
      };
    case LOGGED_IN:
      return {
        ...state,
        ...action.payLoad
      };
    case LOGGED_OUT:
      return {
        ...state,
        isLoggedIn: false,
        isSuperAdmin: false,
        userId: 0
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: action.payLoad
      };
    case RESPONSE_MODAL_CLOSE:
      return {
        ...state,
        responseModel: { isOpen: false, message: "" }
      };
    case RESPONSE_MODAL_OPEN:
      return {
        ...state,
        responseModel: action.payLoad
      };
    case GET_CARD_LIST:
      return {
        ...state,
        brands: action.payLoad.brands,
        giftCards: action.payLoad.gifts,
        updatedList: action.payLoad.updatedList
      };
    case LOAD_MORE_CARDS:
      return {
        ...state,
        giftCards: [...state.giftCards, ...action.payLoad.gifts]
      };
    case FILTTER_CARD_LIST:
      return {
        ...state,
        giftCards: action.payLoad.gifts,
        updatedList: action.payLoad.updatedList
      };
    case UPDATE_SCROLL_DATA:
      return {
        ...state,
        ...action.payLoad
      };
    default:
      return state;
  }
};
