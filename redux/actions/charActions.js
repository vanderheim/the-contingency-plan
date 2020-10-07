import axios from "axios";
import { SET_ITEMS } from "../types";
import { API } from "../../config";

const setitems = () => {
  return (dispatch) => {
    axios
      .get(`${API}/api/contingency`)
      .then((response) => {
        // console.log("got response, sending dispatch", response.data);
        dispatch({ type: SET_ITEMS, payload: response.data });
      })
      .catch((response) => {
        console.log("err", response.data);
      });
  };
};

export default {
  setitems,
};
