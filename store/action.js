import axios from 'axios'
import {
  LOGOUT
} from './contants'

/**
 * 注销
 * @returns {Function}
 */
export const logout = () => {
  return async dispatch => {
    try {
      let res = await axios.post('/logout');
      if (res.status === 200) {
        dispatch({
          type: LOGOUT
        })
      } else {
        console.log('logout failed' + res)
      }
    } catch (e) {
      console.log(e)
    }
  }
};
