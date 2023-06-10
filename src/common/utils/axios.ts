import axios from 'axios';

export const setAxiosDefault = () => {
  axios.defaults.timeout = 60000;
  axios.defaults.timeoutErrorMessage = 'Timed out attempting to reach server';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
};

