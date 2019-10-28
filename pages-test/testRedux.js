import React from 'react'
import {connect} from 'react-redux'
import {withRedux} from '../lib/with-redux'

const mapStateToProps = state => ({
  count: state.counter.count
});

const mapDispatchToProps = dispatch => ({
  add() {
    dispatch({
      type: 'INCREMENT'
    })
  }
});
const Child = connect(
    mapStateToProps,
    mapDispatchToProps
)(Component);

const IndexPage = (props) => {
  return (
      <>
        <Child/>
      </>
  )
};

function Component(props) {
  return (
      <>
        <span>test redux</span>
        <button onClick={() => props.add()}>increment</button>
      </>
  )
}


IndexPage.getInitialProps = ({reduxStore}) => {
  // Tick the time once, so we'll have a
  // valid time before first render
  const {dispatch} = reduxStore;
  dispatch({
    type: 'TICK',
    light: typeof window === 'object',
    lastUpdate: Date.now()
  });
  // 返回一个空对象是因为，我们可以通过connect进行组件的连接。
  return {}
};

export default withRedux(IndexPage)
