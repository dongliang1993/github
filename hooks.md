### hooks的作用
hooks使得让函数组件具有类组件的能力。
### state Hook
#### useState
&#8195;&#8195;useState这个hook使得函数组件具有状态数据；具体用法如下：
```javascript
const [state, setState] = useState(initValue);
// 更新state两种方式，前一种设置的值是不基于最新的state，而后一种是在最新的state的基础上设置的。
setState(statePlus);
setState((state) => statePlus)
```
&#8195;&#8195;useState可以传入一个初始化的值，这个函数返回一个数组，数组的每一项分别是状态数据``state``和修改状态数局的函数``setState``。但是请注意：给``useState``传入的初始值和返回的初始值并不是指向同一个地址的。  
&#8195;&#8195;除此之外useState还可以声明多个，这样``functional component``就具有多个状态。
#### useReducer
&#8195;&#8195;``useReducer``和``useState``类似，都可以解构两个值，不过``useReducer``解构出的两个值不一样。useReducer解构出的值分别是``state``和``dispatch``方法。除此之外，useReducer传入的参数也不一样：
```javascript
const [state, dispatch] = useReducer(reducerFn, initValue, initFn);
```
&#8195;&#8195;上面的代码中use可以接受三个参数：改变state的纯函数、state的初始值、state的reset函数。
#### 例子
```javascript
import React, {Component, Fragment, useState, useEffect, useReducer} from 'react'
// 纯函数
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
  // state的形式
  const [stateCount, setCount] = useState(0);
  // reducer的形式
  const [reducerCount, dispatch] = useReducer(countReducer, 0);
  // useEffect相当于类组件的componentDidMount、componentDidUpdate、componentWillUnMount
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((reducerCount) => reducerCount + 1)
      dispatch({type: 'add'})
    }, 1000);
    return () => clearInterval(timer)
  }, []);
  return (
      <Fragment>
          <span>{stateCount}</span>
          <span>{reducerCount}</span>
      </Fragment>
     )
}
```
### Effect Hook
#### useEffect
&#8195;&#8195;``useEffect``接受两个参数分别是``callback``和``deptch``。前者解释为在组件挂载、更新和卸载阶段做的事，后者解释为执行这些事的依赖项。只有当依赖项发生改变时，才会执行回调函数。``callback``在卸载阶段时可以返回一个函数用来对副作用语句进行清除。
```javascript
const [name, setName] = useState('');
useEffect(() => {
    console.log('effect invoked');
    return () => console.log('effect deteched')
 }, [name]);
```
&#8195;&#8195;上面的代码中，只有当name发生改变时才会执行回调函数callback。  
&#8195;&#8195;重要的知识：
```javascript
const [count, setCount] = useState(0);
useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => count + 1);
    }, 1000);
    return () => clearInterval(timer)
}, []);
```
&#8195;&#8195;上面的代码会在每一秒中更新一次count，但是我们依赖项是一个空数组，并不会发生改变，这为什么会每次都更新count呢？这是因为``setCount(count => count + 1)``在内部形成了闭包，看似没有发生改变，实际上每次更新的count是在前面的count基础上发生的变化，他们指向同一地址，所以不管你依赖项发生变化与否，count都会变。
### Context Hook
#### useContext
&#8195;&#8195;在使用``useContext``之前，我们需要得到从你要使用的是哪个``context``，所以我们需要创建一个context:
```javascript
import React from 'react'
const Context = React.createContext('');
```
&#8195;&#8195;在创建完成context之后，我们需要在根组件上用创建好的context下的Provider对其进行包裹和数据传递。
```javascript
import React from 'react'
const context = React.createContext('');
class myApp extends App {
  state = {
    context: 'value',
  };
  // 更新context函数
  setContext = newContext => {
    this.setState(() => ({context: newContext}))
  };
  render() {
    // 这个Component即渲染的页面
    return (
        <context.Provider value={{context: this.state.context, updateContext: this.setContext}}>
          <B />
        </context.Provider>
    )
  }
}

function B(props){
    // 解构出context.Provider的value属性传递过来的context和updateContext
    const {context, updateContext} = useContext(context);
    return (
        // 通过updateContext进行context的更新
        <button onClick={() => updateContext('context updated')}>Update Context</button>
    )
}
export default myApp
```
&#8195;&#8195;在上面的代码中，我们使用``context.Provider``的``value``属性进行值得传递，这个值我们可以传递任意类型的值，一般来说我们传递一个context和更新context的方法，这个时候就可以使用useReducer来实现redux的类似的操作。  
&#8195;&#8195;在子组件里我们使用``useContext(context)``来获取当前context传递过来的值，此时我们就需要对照传递过来的值进行数据的获取。
### Ref Hook
&#8195;&#8195;在以前的``functional component``中，我们是无法使用ref的。但是现在可以使用``useRef``在函数组件里面使用ref。
```javascript
import React, {useState, useRef} from 'react'
export default function TestRef () {
  const InputRef = useRef(null);
  const [value, setValue] = useState('');
  const handleChange = () => {
    setValue(InputRef.current.value)
  };
  return (
      <input ref={InputRef} type="text" value={value} onChange={handleChange}/>
  )
}
```
### Hooks渲染优化
&#8195;&#8195;在使用hooks进行渲染优化时，我们经常``memo、useMemo、useCallback``这三个进行组件渲染的优化。  
&#8195;&#8195;总所周知，如果我们一个state发生变化的时候那么这个组件及其组件都会重新渲染，而这三个hook可以让react自身记住为变化之前的状态，从而达到优化的目的。
```javascript
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
// 用memo来记住子组件：当回调函数和config都不变的情况下，子组件是不会更新的。
const Child = memo(function ({onButtonClick, config}) {
  console.log('child rendered');
  return (
      <button onClick={onButtonClick} style={{color: config.color}}>{config.text}</button>
  )
});

function MyCountFunc() {
  const [count, dispatchCount] = useReducer(countReducer, 0);
  const [name, setName] = useState('ainuo');
  // 用useMemo记住子组件需要的config数据：当count不发生变化时，config的地址始终不变，不会创建新的config
  const config = useMemo(() => ({
    text: `count is ${count}`,
    color: count > 3 ? 'red' : 'blue'
  }), [count]);
  // 使用useCallback记住事件的处理函数：当dispatchCount这个函数不发生变化时（实际上永远不会发生变化），回调函数就不会重新创建
  const handleButtonClick = useCallback(() => dispatchCount({type: 'add'}), [dispatchCount]);
  // const handleButtonClick = useMemo(() => () => dispatchCount({type: 'add'}), [dispatchCount])
  return (
      <Fragment>
        <input type="text" value={name} onChange={e => setName(e.target.value)}/>
        <Child config={config} onButtonClick={handleButtonClick}/>
      </Fragment>
  )
}
export default MyCountFunc
```
&#8195;&#8195;从上面的代码中，我们可以看出``useCallback``其实就是``useMemo``对回调函数处理的优化。上述的几个**记住**非常重要，因为我们的组件和子组件的更新是依赖数据进行更新的，所以当依赖项不发生改变的时候子组件就不会发生重新渲染。这样可以减少组件树的构建和渲染，极大地优化网页。
