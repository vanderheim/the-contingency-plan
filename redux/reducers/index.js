import { combineReducers } from "redux";
import authReducer from "./authReducer";
import charReducer from "./charReducer";
import ipReducer from "./ipReducer";

const rootReducer = combineReducers({
  user: charReducer,
  authentication: authReducer,
  ip: ipReducer,
});

export default rootReducer;
