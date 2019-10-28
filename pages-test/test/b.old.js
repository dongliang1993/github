import React, {Component, Fragment, useState, useEffect, useReducer} from 'react'
function countReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + 1;
    case 'minus':
      return state - 1;
    default:
      return state;
  }
}
export default function Func() {
  // const [stateCount, setCount] = useState(0);
  const [reducerCount, dispatch] = useReducer(countReducer, 0);
  const [name, setName] = useState('');
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCount((stateCount) => stateCount + 1);
  //     dispatch({type: 'add'})
  //   }, 1000);
  //   return () => clearInterval(timer)
  // }, []);

  useEffect(() => {
    console.log('effect invoked');
    return () => console.log('effect deteched')
  }, [name]);
  return (
      <Fragment>
        {/*<span>{stateCount}</span>*/}
        <span>{reducerCount}</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        <button onClick={() => dispatch({type: 'add'})}>add</button>
      </Fragment>
  )
}
