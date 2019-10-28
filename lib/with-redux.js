import React from 'react'
import {initializeStore} from '../store/store'
// 判断是否是在服务端
const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
  // 服务端直接返回初始化的store
  if (isServer) {
    return initializeStore(initialState)
  }
  // 非服务端则挂载一个对象
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}

export default App => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps(appContext) {
      // 注入reduxStore
      let reduxStore;
      // 服务端同步redux
      if (isServer) {
        const {req} = appContext.ctx;
        const session = req.session;
        // 如果存在session.user则设置session
        if (session && session.userInfo) {
          reduxStore = getOrCreateStore({
            user: session.userInfo
          });
        } else {
          reduxStore = getOrCreateStore();
        }
      } else {
        reduxStore = getOrCreateStore();
      }
      // 向ctx挂载一个reduxStore对象
      appContext.ctx.reduxStore = reduxStore;
      let appProps = {};
      // APP组件有getInitialProps方法，则执行这个方法得到appProps，再将appProps作为props返回
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext)
      }
      return {
        ...appProps,
        initialReduxState: reduxStore && reduxStore.getState() || {}
      }
    }

    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore}/>
    }
  }
}
