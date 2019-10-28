/**
 * 运用cloneElement完成组件的扩展。cloneElement拷贝得到的组件和createElement的参数一样。
 */

import {cloneElement} from "react";

const style = {
  width: '100%',
  maxWidth: 1200,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 20,
  paddingRight: 20
};
export default ({children, renderer = <div/>}) => {
  return cloneElement(renderer, {
    style: Object.assign({}, style, renderer.props.style),
    children
  })
}
