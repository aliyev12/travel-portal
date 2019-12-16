import axios from 'axios';
import { showAlert } from './alerts';
import { domain, sendClientError } from './index';

// Type is either password or data
export async function updateSettings(data, type) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${domain}/api/v1/users/${
        type === 'password' ? 'updateMyPassword' : 'updateMe'
      }`,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully.`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
    sendClientError(error);
  }
}
