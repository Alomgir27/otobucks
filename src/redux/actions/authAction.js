import { actionTypes } from '../types';
import { post } from '../../services/RestService';
import { openErrorNotification } from '../../helpers';

// Login - Get User Token
export const loginUser = (userData) => (dispatch) => {
  post('/auth/providers/login/serviceProvider', userData)
    .then((res) => {
      const { token } = res;
      // Set token to ls
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data));
      //set Data
      dispatch(setCurrentUser(res));
    })
    .catch((err) => {
      openErrorNotification(err.message);
      dispatch({
        type: actionTypes.LOGIN_ERROR,
        payload: err.message,
      });
    });
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  // Remove auth header for future requests
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
