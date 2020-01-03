import jwt from "jsonwebtoken";
import axios from "axios";

export const columnCount = 3;
let BASE_URL = null;
if (window.location.href.includes("localhost")) {
  BASE_URL = "http://localhost:3001";
} else {
  BASE_URL = "https://gifting-application-api.herokuapp.com";
}
export const emailJS_userId = "user_5xzHvPpdx2ROe41SdDi9Z";

export const getSearchParams = searchParam => {
  let search = searchParam || window.location.search;
  let searchObj = search
    ? JSON.parse(
        '{"' +
          decodeURI(search)
            .replace("?", "")
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
    : {};
  return searchObj;
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`);
  const categories = await response.json();
  return categories;
};

export const getGiftsList = async params => {
  const qParams = constructQueryParam(params);
  const response = await fetch(`${BASE_URL}/gifts?${qParams}`);
  const gifts = await response.json();
  return gifts;
};
export const getGiftsListForInfiniteScroll = async params => {
  const qParams = constructQueryParam(params);
  const response = await axios.get(`${BASE_URL}/gifts?${qParams}`);
  return response;
};
export const getBrandList = async params => {
  const response = await fetch(
    `${BASE_URL}/brands?categoryId=${params.categoryId}`
  );
  const brands = await response.json();
  return brands;
};

export const constructQueryParam = params => {
  let queryString = "";
  for (let key in params) {
    let parameter = `${key}=${params[key]}`;
    if (queryString !== "") {
      queryString += `&${parameter}`;
    } else {
      queryString += parameter;
    }
  }
  return queryString;
};

export const createUser = async data => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const message = await response.json();
  return message;
};
export const getUserByEmail = async email => {
  const response = await fetch(`${BASE_URL}/users?email=${email}`);
  const userResp = await response.json();
  return userResp;
};

export const getUserDetails = () => {
  let authToken = localStorage.getItem("auth-token");
  if (authToken) {
    let decodedToken = jwt.decode(authToken);
    let { name, picture, email } = decodedToken;
    return {
      name,
      picture,
      email
    };
  }
  return {};
};

export const sendGift = async data => {
  const response = await fetch(`${BASE_URL}/user-gifts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const sendGiftResp = await response.json();
  return sendGiftResp;
};

export const updateUser = async data => {
  const response = await fetch(`${BASE_URL}/users/${data.userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data.payLoad)
  });
  const message = await response.json();
  localStorage.setItem("userData", JSON.stringify(message));
  return message;
};

export const getUserGifts = async params => {
  const qParam = constructQueryParam(params);
  const response = await fetch(`${BASE_URL}/user-gifts?${qParam}`);
  const userGifts = await response.json();
  return userGifts;
};

export const authLoginCheck = (isLoggedIn, history) => {
  if (!isLoggedIn) {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userData");
    history.push("/");
  }
};

export const updateUserGift = async (id, data) => {
  const response = await fetch(`${BASE_URL}/user-gifts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const updateGiftResp = await response.json();
  return updateGiftResp;
};

export const createGift = async data => {
  const response = await fetch(`${BASE_URL}/gifts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const createGiftResp = await response.json();
  return createGiftResp;
};

export const getValidationCls = (errors, fieldName, getIn) => {
  if (getIn(errors, fieldName)) return "error";
  return "success";
};

export const doLoginAfterRefresh = dispatch => {
  const authToken = localStorage.getItem("auth-token");
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (authToken && userData) {
    dispatch({
      type: "LOGGED_IN",
      payLoad: {
        isLoggedIn: true,
        isSuperAdmin: userData.isAdmin,
        userId: userData.id,
        userData: userData
      }
    });
  }
};

export const getGiftById = async id => {
  const response = await fetch(`${BASE_URL}/gifts/${id}`);
  const giftData = await response.json();
  return giftData;
};

export const getCommentsByGiftId = async id => {
  const response = await fetch(`${BASE_URL}/comments-reviews?giftId=${id}`);
  const comments = await response.json();
  return comments;
};

export const getFavoriteList = async params => {
  let qParam = "";
  params.forEach(element => {
    qParam += qParam ? `&id=${element}` : `id=${element}`;
  });
  const response = await fetch(`${BASE_URL}/gifts?${qParam}`);
  const gifts = await response.json();
  return gifts;
};

export const updateGift = async (id, data) => {
  const response = await fetch(`${BASE_URL}/gifts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const updateGiftResp = await response.json();
  return updateGiftResp;
};

export const createUpdatedList = products => {
  let rowArr = [];
  let gridArr = [];
  for (let i = 1; i <= products.length; ++i) {
    rowArr.push(products[i - 1]);
    if (i % columnCount === 0) {
      gridArr.push(rowArr);
      rowArr = [];
    } else if (i === products.length) {
      gridArr.push(rowArr);
    }
  }
  return gridArr;
};
