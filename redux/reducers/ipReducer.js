import { SET_IP } from "../types";

const initialState = {
  ip: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IP:
      return { ip: action.payload };
    default:
      return state;
  }
};
