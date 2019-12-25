 /* eslint-disable */ 

import axios from 'axios';
import { showAlert } from './alerts';
import { sendClientError } from './index';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/logout`
    });
    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (error) {
    showAlert('error', 'Error logging out, try again.');
    sendClientError(error);
  }
};
