import { AUTHENTICATE, DEAUTHENTICATE, SET_PROFILE } from "../types";

const initialState = {
  token: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return { token: action.payload };
    // case SET_PROFILE:
    //   return { profile: action.payload };
    case DEAUTHENTICATE:
      return { token: null };
    default:
      return state;
  }
};
