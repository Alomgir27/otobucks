import { actionTypes } from "../types";

const initialState = {};
const profile = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_DATA:
      return { ...state, user: action.payload };
    case actionTypes.SET_SERVICE_CATEGORIES:
      return {
        ...state,
        serviceCategories: action.payload,
      };
    case actionTypes.SET_USER_STORES:
      return {
        ...state,
        stores: action.payload,
      };
    case actionTypes.SET_SERVICE_SUBCATEGORIES:
      return {
        ...state,
        subCategories: action.payload,
      };
    case actionTypes.SET_UNREAD_CHATS:
      return {
        ...state,
        unReadChats: action.payload,
      };
    default:
      return state;
  }
};

export default profile;
