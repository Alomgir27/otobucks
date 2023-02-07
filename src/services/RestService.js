import axios from 'axios';
import { logout } from '../helpers';

const token = localStorage.getItem('token');

let API_URL =
  process.env.REACT_APP_NODE_ENV == 'development'
    ? process.env.REACT_APP_DEVELOPMENT_API_URL
    : process.env.REACT_APP_PRODUCTION_API_URL;

function handleError(error, reject) {
  let err = '';

  if (error && error.response && error.response.data)
    err = error.response.data.msg || error.response.data;
  else err = 'please check internet connection';

  err = err || 'please try again later';

  reject(err);
}

const options = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const get = (url, options = {}, auth) => {
  return new Promise(async (resolve, reject) => {
    axios
      .get(`${API_URL}${url}`, options)
      .then((response) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          // logout();
        }
        handleError(error, reject);
      });
  });
};

const post = (url, payload, options = {}) => {
  return new Promise(async (resolve, reject) => {
    axios
      .post(`${API_URL}${url}`, payload, options)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          logout();
        }
        handleError(error, reject);
      });
  });
};

const patch = (url, payload, options = {}) => {
  return new Promise(async (resolve, reject) => {
    axios
      .patch(`${API_URL}${url}`, payload, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          logout();
        }
        handleError(error, reject);
      });
  });
};

const put = (url, payload, options = {}) => {
  return new Promise(async (resolve, reject) => {
    axios
      .put(`${API_URL}${url}`, payload, options)
      .then((response) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          logout();
        }
        handleError(error, reject);
      });
  });
};

const deleteService = (url, payload) => {
  var config = {
    method: 'delete',
    url: `${API_URL}${url}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return new Promise(async (resolve, reject) => {
    axios(config)
      .then((response) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          logout();
        }
        reject(error);
        handleError(error, reject);
      });
  });
};

export { get, post, put, patch, deleteService, options };
