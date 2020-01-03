import React, { useContext, useState } from "react";
import { useHistory, NavLink, useParams } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@material-ui/core";
import { GoogleLogin, GoogleLogout } from "react-google-login";

import Navigation from "./../Navigation/Navigation";
import SearchField from "./../Search/Search";
import { GET_CARD_LIST } from "./../../utilities/AppReducer";
import { AppStateContext, AppDispatchContext } from "./../../../../App";
import {
  getUserDetails,
  getUserByEmail,
  createUser,
  getGiftsListForInfiniteScroll,
  getBrandList,
  createUpdatedList,
  getSearchParams
} from "./../../utilities/utils";

import "./Header.css";

const Header = () => {
  const host = window.location.href;
  let clientId =
    "323686087428-evkd47joq7mdtn2129ui1fjibrmipuj2.apps.googleusercontent.com";
  if (host.includes("localhost")) {
    clientId =
      "136857640226-bck35sdmqtl1blj92o7rljvm3k4dtt8v.apps.googleusercontent.com";
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const param = useParams();
  const appState = useContext(AppStateContext);
  const appDispatcher = useContext(AppDispatchContext);
  const userInfo = getUserDetails();
  const { isLoggedIn, isSuperAdmin, userId } = appState;

  const handleLogin = async response => {
    if (response && response.tokenId) {
      localStorage.setItem("auth-token", response.tokenId);
      let userInformation = getUserDetails();
      const userData = await getUserByEmail(userInformation.email);
      if (!userData.length) {
        const userDetails = {
          name: userInformation.name,
          email: userInformation.email,
          balancePoints: 0,
          isAdmin: false,
          favorites: [],
          image: userInformation.picture
        };
        const createResp = await createUser(userDetails);
        if (createResp.id) {
          appDispatcher.dispatch({
            type: "LOGGED_IN",
            payLoad: {
              isSignedIn: true,
              isSuperAdmin: false,
              userData: createResp
            }
          });
          return;
        }
      }
      localStorage.setItem("userData", JSON.stringify(userData[0]));
      appDispatcher.dispatch({
        type: "LOGGED_IN",
        payLoad: {
          isLoggedIn: true,
          isSuperAdmin: userData[0].isAdmin,
          userId: userData[0].id,
          userData: userData[0]
        }
      });
    }
  };
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userData");
    appDispatcher.dispatch({ type: "LOGGED_OUT" });
    setAnchorEl(null);
    history.push("/");
  };
  const handleOnKeyUp = async event => {
    const value = event.target.value;
    const qParams = getSearchParams();
    if (!param.productId && event.keyCode === 13)
      history.push(`/gift-lists/search?q=${value}`);
    else if (window.location.pathname !== "/") {
      let brandCategory = [];
      let newParam = { ...param, q: value };
      if (qParams.categoryId) {
        newParam = { ...newParam, categoryId: qParams.categoryId };
      }
      let gifts = await getGiftsListForInfiniteScroll(newParam);
      if (param.categoryId) brandCategory = await getBrandList(newParam);
      let brands =
        brandCategory[0] && brandCategory[0].brand
          ? brandCategory[0].brand
          : [];
      const updatedList = createUpdatedList(gifts.data);
      appDispatcher.dispatch({
        type: GET_CARD_LIST,
        payLoad: { gifts, brands, updatedList }
      });
    }
  };
  return (
    <div id="id_navigation">
      <header>
        <div className="cls_headerCont">
          <div className="cls_leftCont">
            <div className="cls_logo" onClick={() => history.push("/")}>
              YOYO Gifts
            </div>
            <div className="cls_searchCont">
              <SearchField handleOnKeyUp={handleOnKeyUp} />
            </div>
          </div>
          <div className="cls_rightCont">
            {isLoggedIn ? (
              <div className="cls_greetUser">Hi, {userInfo.name}</div>
            ) : (
              ""
            )}
            <Avatar>
              {!isLoggedIn ? (
                <GoogleLogin
                  clientId={clientId}
                  buttonText=""
                  cookiePolicy={"single_host_origin"}
                  onSuccess={handleLogin}
                  onFailure={handleLogin}
                />
              ) : (
                <div className="cls_userImage">
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    name="Profile button"
                  >
                    <img src={userInfo.picture} alt={userInfo.name}></img>
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {isSuperAdmin ? (
                      <NavLink to={`/dashboard`}>
                        <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                      </NavLink>
                    ) : (
                      <NavLink to={`/profile?userId=${userId}`}>
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                      </NavLink>
                    )}

                    <MenuItem onClick={handleClose}>
                      <GoogleLogout
                        clientId={clientId}
                        buttonText="Logout"
                        onLogoutSuccess={handleLogout}
                      >
                        Logout
                      </GoogleLogout>
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </Avatar>
          </div>
        </div>
        <Navigation categories={appState.categories} />
      </header>
    </div>
  );
};

export default React.memo(Header);
