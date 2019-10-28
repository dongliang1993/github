import React, {Component, Fragment, useEffect} from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import getConfig from 'next/config'
import axios from 'axios'

const {publicRuntimeConfig} = getConfig();
const Span = styled.span`
    color: red
`;
const events = [
  'routeChangeStart',
  'routeChangeComplete',
  'routeChangeError',
  'beforeHistoryChange',
  'hashChangeStart',
  'hashChangeComplete'
];

export default class App extends Component {
  // 编程式路由传参
  goToTestA = () => {
    Router.push({
      pathname: '/a',
      query: {
        id: 1
      }
    }, '/a/1')
  };

  emitEvent = (type) => {
    return (...args) => {
      console.log(type, ...args)
    }
  };

  componentDidMount() {
    events.forEach(event => {
      Router.events.on(event, this.emitEvent(event))
    })
  }

  render() {
    console.log(publicRuntimeConfig);
    return (
        <Fragment>
          {/*标签式路由传参*/}
          <Span>Index</Span>
          <a href={publicRuntimeConfig.OAUTH_URL}>github登陆</a>
          <Child/>
        </Fragment>
    )
  }
}

function Child() {
  useEffect(() => {
    axios.get('/api/user/info').then(res => console.log(res))
  }, []);
  return (
      <Fragment>

      </Fragment>
  )
}
