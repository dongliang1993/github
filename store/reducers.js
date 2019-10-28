/**
 * user的reducer
 */
import {
  LOGOUT
} from './contants'
// 初始状态
export const userInitialState = {};

export function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT:
      return {};
    default:
      return state
  }
}
