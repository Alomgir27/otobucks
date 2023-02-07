import { actionTypes } from '../types'

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: '',
  user: {}
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
        loading: false
      };
      case actionTypes.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}

export default authReducer