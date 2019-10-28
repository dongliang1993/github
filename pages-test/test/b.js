import React, {useReducer, useState, Fragment, memo, useMemo, useCallback} from 'react'

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

const Child = memo(function ({onButtonClick, config}) {
  return (
      <button onClick={onButtonClick} style={{color: config.color}}>{config.text}</button>
  )
});

function MyCountFunc() {
  const [count, dispatchCount] = useReducer(countReducer, 0);
  const [name, setName] = useState('ainuo');
  const config = useMemo(() => ({
    text: `count is ${count}`,
    color: count > 3 ? 'red' : 'blue'
  }), [count]);

  const handleButtonClick = useCallback(() => dispatchCount({type: 'add'}), [dispatchCount]);

  return (
      <Fragment>
        <input type="text" value={name} onChange={e => setName(e.target.value)}/>
        <Child config={config} onButtonClick={handleButtonClick}/>
      </Fragment>
  )
}

export default MyCountFunc
