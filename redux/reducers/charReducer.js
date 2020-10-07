import { SET_ITEMS, SET_PROFILE, DEAUTHENTICATEPROF } from "../types";

const initialState = {
  profile: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return { profile: action.payload };
    case DEAUTHENTICATEPROF:
      return { profile: null };
    default:
      return state;
  }
};
