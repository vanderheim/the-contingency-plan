import Router from "next/router";
import axios from "axios";
import {
  SET_IP,
  AUTHENTICATE,
  DEAUTHENTICATE,
  SET_PROFILE,
  DEAUTHENTICATEPROF,
} from "../types";
import { API } from "../../config";
import { setCookie, removeCookie } from "../../utils/cookie";

const setip = (ip) => {
  return (dispatch) => {
    dispatch({ type: SET_IP, payload: ip });
    // const response = await axios.get(`${API}/user`, {
    //   headers: {
    //     authorization: token
    //   }
    // });
    //
    // dispatch({ type: SET_PROFILE, payload: response.data.user });

    // dispatch({ type: AUTHENTICATE, payload: token });
    //   dispatch({ type: SET_PROFILE, payload: { hi: 'hi'} });
  };
};

const profile = ({ email, password }, type) => {
  if (type !== "signin" && type !== "signup") {
    throw new Error("Wrong API call!");
  }
  return (dispatch) => {
    axios
      .post(`${API}/api/${type}`, { email, password })
      .then((response) => {
        console.log("response");
        console.log(response.data);
        dispatch({ type: SET_PROFILE, payload: response.data.profile });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };
};

// gets token from the api and stores it in the redux store and in cookie
const authenticate = (
  { email, password, username, region, characters, ip, bio },
  type
) => {
  if (type !== "signin" && type !== "signup") {
    throw new Error("Wrong API call!");
  }

  if (type === "signin") {
    return async (dispatch) => {
      await axios
        .post(`${API}/api/${type}`, { email, password })
        .then((response) => {
          console.log("response 2", response);
          dispatch({ type: SET_PROFILE, payload: response.data.profile });

          return response;
        })
        .then((response) => {
          console.log("response", response);
          dispatch({ type: AUTHENTICATE, payload: response.data.token });
          console.log("ok");

          return response;
        })
        .then((response) => {
          setCookie("token", response.data.token);
          Router.push("/");
        })
        .catch((err) => {
          console.log("err!", err);
        });
    };
  }

  if (type === "signup") {
    return async (dispatch) => {
      await axios
        .post(`${API}/api/${type}`, {
          email,
          password,
          username,
          region,
          characters,
          ip,
          bio,
        })
        .then((response) => {
          console.log("response 2", response);
          dispatch({ type: SET_PROFILE, payload: response.data.profile });

          return response;
        })
        .then((response) => {
          console.log("response", response);
          dispatch({ type: AUTHENTICATE, payload: response.data.token });
          console.log("ok");

          return response;
        })
        .then((response) => {
          setCookie("token", response.data.token);
          Router.push("/");
        })
        .catch((err) => {
          console.log("err!", err);
        });
    };
  }
};

// gets the token from the cookie and saves it in the store
const reauthenticate = (token) => {
  return (dispatch) => {
    dispatch({ type: AUTHENTICATE, payload: token });
    // const response = await axios.get(`${API}/user`, {
    //   headers: {
    //     authorization: token
    //   }
    // });
    //
    // dispatch({ type: SET_PROFILE, payload: response.data.user });

    // dispatch({ type: AUTHENTICATE, payload: token });
    //   dispatch({ type: SET_PROFILE, payload: { hi: 'hi'} });
  };
  //   console.log("dispatching reauthenticate");
  //   dispatch({ type: AUTHENTICATE, payload: token });
  //
  //   axios
  //     .get(`${API}/user`, {
  //       headers: {
  //         authorization: token
  //       }
  //     })
  //     .then(response => {
  //       console.log("user response");
  //       console.log(response.data.user);
  //       console.log("token", token);
  //       dispatch({ type: SET_PROFILE, payload: response.data.user });
  //     })
  //     .catch(err => {
  //       throw new Error(err);
  //     });
  //   dispatch({ type: AUTHENTICATE, payload: token });
  // };
};

// gets the token from the cookie and saves it in the store
const refetch = (token) => {
  return async (dispatch) => {
    const response = await axios.get(`${API}/api/user`, {
      headers: {
        authorization: token,
      },
    });

    console.log("response from refetch" + response.data);
    dispatch({ type: SET_PROFILE, payload: response.data });
  };
};

// removing the token
const deauthenticate = () => {
  return (dispatch) => {
    removeCookie("token");
    Router.push("/");
    dispatch({ type: DEAUTHENTICATE });
    // dispatch({ type: DEAUTHENTICATEPROF });
  };
};

export default {
  setip,
  authenticate,
  reauthenticate,
  deauthenticate,
  profile,
  refetch,
};
