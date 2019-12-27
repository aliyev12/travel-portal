/* eslint-ignore */
import axios from 'axios';
import { showAlert } from './alerts';
import { sendClientError } from './index';

export async function login(email, password) {
  try {
    console.log('inside login function...');
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/login`,
      data: { email, password }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
    sendClientError(error);
  }
}
