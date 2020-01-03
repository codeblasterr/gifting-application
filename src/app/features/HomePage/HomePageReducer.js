export const GET_CATEGORIES = "GET_CATEGORIES";
export const initialState = {
  categories: []
};

export const homePageReducer = (state, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payLoad
      };
    default:
      return state;
  }
};
