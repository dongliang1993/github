### store文件
```javascript
import { createStore, applyMiddleware } from 'redux'

// redux的初始值
const initialState = {
  lastUpdate: 0,
  light: false,
  count: 0
};

// reducer纯函数 
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TICK':
      return {
        ...state,
        lastUpdate: action.lastUpdate,
        light: !!action.light
      };
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      };
    case 'RESET':
      return {
        ...state,
        count: initialState.count
      };
    default:
      return state
  }
};

// 服务端渲染，我们需要在每次刷新浏览器的时候重新生成store，保证服务端的store是独立的。
export const initializeStore = (preloadedState = initialState) => {
  return createStore(
      // reducer
      reducer,
      // reducer的初始值
      preloadedState,
      // 安装插件
      applyMiddleware()
  )
};
```
### 高阶组件withRedux
```javascript
import React from 'react'
import {Provider} from 'react-redux'
import {initializeStore} from '../store/store'
import App from 'next/app'
// 返回一个高阶组件，将store传递给包裹的组件
export const withRedux = (PageComponent, {ssr = true} = {}) => {
  const WithRedux = ({initialReduxState, ...props}) => {
    const store = getOrInitializeStore(initialReduxState);
    return (
        <Provider store={store}>
          <PageComponent {...props} />
        </Provider>
    )
  };

  // Make sure people don't use this HOC on _app.js level
  if (process.env.NODE_ENV !== 'production') {
    const isAppHoc =
        PageComponent === App || PageComponent.prototype instanceof App;
    if (isAppHoc) {
      throw new Error('The withRedux HOC only works with PageComponents')
    }
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
        PageComponent.displayName || PageComponent.name || 'Component';

    WithRedux.displayName = `withRedux(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithRedux.getInitialProps = async context => {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrInitializeStore();

      // Provide the store to getInitialProps of pages
      context.reduxStore = reduxStore;

      // Run getInitialProps from HOCed PageComponent
      const pageProps =
          typeof PageComponent.getInitialProps === 'function'
              ? await PageComponent.getInitialProps(context)
              : {};

      // Pass props to PageComponent
      return {
        ...pageProps,
        initialReduxState: reduxStore.getState()
      }
    }
  }

  return WithRedux
};

let reduxStore;
const getOrInitializeStore = initialState => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === 'undefined') {
    return initializeStore(initialState)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!reduxStore) {
    reduxStore = initializeStore(initialState)
  }

  return reduxStore
};

```
### 使用
```javascript
import React from 'react'
import { withRedux } from '../lib/with-redux'

const IndexPage = (props) => {
  console.log(props.counter);
  return (
      <>
        <span>test redux, {props.counter.lastUpdate}</span>
      </>
  )
};

IndexPage.getInitialProps = ({ reduxStore }) => {
  // Tick the time once, so we'll have a
  // valid time before first render
  const { dispatch } = reduxStore;
  dispatch({
    type: 'TICK',
    light: typeof window === 'object',
    lastUpdate: Date.now()
  });
  return reduxStore.getState()
};

export default withRedux(IndexPage)

```
