### 目录结构
1. pages(必需)：<font color="red">pages</font>目录是nextjs中最终要的一个目录，这个目录的每一个文件都会对应到每一个页面，可以根据地址栏的路由进行跳转。若pages下的js文件在一个目录下，那么nextjs默认会将这个目录也当作路由的路径。  
2. components(非必需)：<font color="red">components</font>目录存放的是一些公用的组件，这些代码不能放在pages下，不然的话就会以页面的形式进行导出。
3. lib(非必需)：<font color="red">lib</font>目录存放一些工具方法，比如util等等。
4. static(非必需)：<font color="red">static</font>目录存放一些静态资源文件，比如图片和公共的css样式。
### next的默认文件
1. index.js：nextjs的pages下默认入口文件，这个文件会对应浏览器地址栏为根路径的那个页面
2. _app.js：nextjs的全局组件，一般来说我们需要对这个组件进行重写，重写的时候一般进行一些公共的操作，比如：导入全局的css、给页面传入数据(执行每个页面的``getInitialProps``方法)、用``componentDidCatch``进行自定义错误处理等等
3. _error.js：nextjs的错误页面，这个页面也可以用来重写，当路由不存在时就会显示该页面。
4. _document.js：nextjs只在服务端运行的js文件，客户端运行时不起作用。一般来说它用来修改服务端渲染给客户端的html文件的格式，比如我们可以在这个js文件加入``styled-components``等``style-in-js``方案配置、修改返回给客户端的html（给客户端的html文件加上title等等），
### 路由跳转
#### 标签式路由跳转
&#8195;&#8195;在nextjs中我们使用next内置的Link组件进行跳转，而是要Link组件本身不渲染组件，而要根据传入的组件进行渲染然后进行跳转。但是请注意这只是前端的跳转，相当于``react-router-dom``的Link组件
```javascript
import React, {Component, Fragment} from 'react'
import Link from 'next/link'
export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Link href="/a">
                    <button>asd</button>
                </Link>
            </Fragment>
        )
    }
}
```
&#8195;&#8195;注意：**Link组件下的children只能是单独的一个，而不能是多个子节点**，因为Link组件是给他的子节点增加点击事件，如果需要给多个组件绑定点击事件，可以用一个根节点包裹起来，比如：
```javascript
import React, {Component, Fragment} from 'react'
import Link from 'next/link'
export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Link href='/a' title='aaa'>
                    <Fragment>
                        <button>to a</button>
                        <button>to A</button>
                    </Fragment>
                </Link>
            </Fragment>
        )
    }
}
```
#### 编程式路由跳转
&#8195;&#8195;编程式路由跳转需要借助next的router模块，使用方法和``react-router-dom``的``history``模式一样，可以通过``push、replace``等等方法进行跳转
```javascript
import React, {Component, Fragment} from 'react'
import Router from 'next/router'
export default class App extends Component {
    goToTestB = () => {
        Router.push('/test/b')
    };
    goToTestC = () => {
        Router.push({
            pathname: '/test/c',
        })
    }
    render() {
        return (
            <Fragment>
                <button onClick={this.goToTestB}>this is a</button>
                <button onClick={this.goToTestC}>this is c</button>
            </Fragment>
        )
    }
}
```
### 动态路由
&#8195;&#8195;动态路由指的是：切换页面时我们需要给下一个页面传递一些参数，页面根据这些参数进行相关的渲染。  
&#8195;&#8195;在``react-router-dom``中我们可以使用``params``和``query``的方式进行动态数据的传递，而在next的动态路由跳转中则只能使用``query``来传递相关参数。

```javascript
// index.js
import React, {Component, Fragment} from 'react'
import Link from 'next/link'
import Router from 'next/router'
export default class App extends Component {
    // 编程式路由传参
    goToTestC = () => {
        Router.push({
            pathname: '/a',
            query: {
                id: 1
            }
        })
    }
    render() {
        return (
            <Fragment>
                {/*标签式路由传参*/}
                <Link href='/a?id=1'>
                    <button>to a</button>
                </Link>
                <button onClick={this.goToTestC}>to a</button>
            </Fragment>
        )
    }
}

// a.js
import React, {Component, Fragment} from 'react'
import {withRouter} from 'next/router'
class App extends Component {
    render() {
        // 当使用withRouter这个高阶组件时，会在props组件的props上添加一个router对象，
        // 根据router对象就可以得到query参数
        const {router} = this.props;
        console.log(router.query.id)
        return (
            <Fragment>
                <button onClick={this.goToTestB}>this is a</button>
            </Fragment>
        )
    }
}
// 使用高阶组件将APP装饰以下。如果开启了装饰器，则可以使用装饰器模式
export default withRouter(App)
```
### 路由映射
&#8195;&#8195;路由映射是指：比如有一个博文的path是``/post?id=2&articleId=199``，这样的路由看起来是不友好的。我们想要的是``:/post/2/199``，这样的路径。从前种方法到后种方法之间的转换就叫做路由映射。  
#### 标签式路由映射  
&#8195;&#8195;在next中由于不能传递``params``，所以我们需要使用next种Link组件提供的**as**属性，在as属性中就可以通过传递``params``进行后面种类的path。  
&#8195;&#8195;在next的Link组件中的``as``和``href``的区别在于：as是浏览器地址栏**显示**的path，并不是真正的path；而href才是真正的跳转路径（服务端的路径）。总的来说as是客户端显示的路径，而href是服务端真实跳转的路径。
#### 编程式路由映射
&#8195;&#8195;在next的Router对象中我们也可以使用路由映射使客户端显示的路径变得更加简洁。即在``push``或其他方式进行跳转的时候传入第二个路径，这个路径就是在客户端地址栏显示的路径。
```javascript
import React, {Component, Fragment} from 'react'
import Router from 'next/router'
import Link from 'next/link'

export default class App extends Component {
    goToTestA = () => {
        Router.push({
            pathname: '/a',
            query: {
                id: 1
            }
        }, '/a/1')
    };

    render() {
        return (
            <Fragment>
                <Link href='/a?id=1' as='/a/1'>
                    <button>to a</button>
                </Link>
                <button onClick={this.goToTestA}>to a</button>
            </Fragment>
        )
    }
}
```
#### 路由映射存在的问题
&#8195;&#8195;路由映射存在的一个问题就是当我们通过路由映射跳转页面之后刷新，会找不到页面。因为这个时候我们刷新时服务器会根据我们地址栏的``path``在pages文件里面查找a文件夹的1.js文件，发现并不存在这个文件，所以浏览器会报404的错误。  
&#8195;&#8195;那为什么之前我们却能成功进行跳转呢？因为我们实现的是一个单页应用，使用next提供的Link组件或Router对象的方法进行跳转时我们并没有发出请求，也没有刷新浏览器，是直接跳转的，这个时候并不会出现错误。但是当我们刷新页面时发出了请求，服务器就会根据路径在pages下寻找文件。  
#### 路由映射问题的解决方法
&#8195;&#8195;路由映射存在的问题就是在于对服务器发起请求的与否，所以我们需要在使用路由映射跳转的时候，需要使用``koa``进行相关的拦截，然后更新服务端的路径  
&#8195;&#8195;以下例子是koa集成next服务器的例子：
```javascript
const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
// 创建一个app，并指定为开发状态
const dev = process.env.NODE_ENV !== 'production';
const app = next({
    dev
});
const handle = app.getRequestHandler();
// 等pages下面的所有页面编译完成之后启动服务，响应请求
app.prepare().then(() => {
    // 实例化KoaServer
    const server = new Koa();
    const router = new Router();
    server.use(router.routes());
    // 根据浏览器地址栏请求的params来进行相关query的配置
    router.get('/a/:id', async ctx => {
        const id = ctx.params.id;
        await app.render(ctx.req, ctx.res, '/a', {id});
        ctx.respond = false
    });
    // 通配符
    router.get('*', async ctx => {
        await handle(ctx.req, ctx.res);
        // hack手段，兼容node底层的req和res
        ctx.respond = false
    });
    // 使用中间件
    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next()
    });
    // 监听端口
    server.listen(3000, () => {
        console.log('koa server listening on 3000')
    });
});

```
### 路由钩子
&#8195;&#8195;路由钩子指的是在next中进行路由跳转时，执行的函数。分别是：
1. routeChangeStart：开始跳转时触发。
2. routeChangeComplete：跳转完成之后触发。
3. routeChangeError：跳转到一个不存在的路径触发。
4. beforeHistoryChange：启用history路由，在跳转成功前触发。
5. hashChangeStart：启用hash路由时，在开始跳转时触发
6. hashChangeComplete：启用hash路由时，在跳转成功后触发。
```javascript
// index.js
const events = [
    'routeChangeStart',
    'routeChangeComplete',
    'routeChangeError',
    'beforeHistoryChange',
    'hashChangeStart',
    'hashChangeComplete'
];

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
```
### next获取数据的方式
&#8195;&#8195;在next服务端渲染获取数据使用的是``getInitialProps``，这个方法是一个静态方法，是next提供的一个内置的方法。这是一个非常重要的静态方法，它能够为我们同步客户端和服务端的数据，所以我们应该尽量将数据相关的内容的操作放到``getInitialProps``去做。  
&#8195;&#8195;在``getInitialProps``里面返回的数据都会作为``props``传递到实例出的组件。但是请注意：**只有pages下的页面组件才会调用getInitialProps这个静态方法**，而放在components下的组件则不会存在该方法，除此之外而且这个方法在服务端和客户端都会被执行。  
&#8195;&#8195;这时候打开我们的浏览器调试工具``network``，点击a页面请求的``preview``，我们可以很清楚的看到有个返回的数据是有刚刚在``getInitProps``方法返回的数据的，这是因为react的服务端渲染有一个``hydrate``方法，他会复用我们在服务端已经渲染好的html。  
&#8195;&#8195;注意：``getInitialProps``方法在服务端和客户端都仅仅只执行一次。
```javascript
import React, {Component, Fragment} from 'react'
import Router, {withRouter} from 'next/router'
class App extends Component {
    static getInitialProps = async () => {
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve({name: 'ainuo'})
            }, 1000)
        });
        return await promise
    }
    render() {
        console.log(this.props.name)
        return (
            <Fragment>
                 <button>{this.props.name}</button>
            </Fragment>
        )
    }
}

export default withRouter(App)
```
### 自定义APP
&#8195;&#8195;自定义APP即重写_app.js，来覆盖next提供的默认的_app.js。那么重写_app.js的作用是什么呢？  
1. 固定layout
2. 保持一些公用的状态，比如redux的使用。
3. 给页面传入一些自定义的数据
4. 自定义错误处理
#### 传递自定义数据
&#8195;&#8195;传递自定义数据即执行每个对象上得``getInitialProps``方法，然后传递到``Component``页面。
```javascript
import App from 'next/app'
import 'antd/dist/antd.css'

class myApp extends App {
// 这里方法在每次切换页面都会执行
    static getInitialProps = async ({Component}) => {
        let pageProps = {};
        // 判断当前页面是否存在getInitialProps方法
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps()
        }
        return {pageProps}
    };

    render() {
        // 这个Component即渲染的页面
        const {Component, pageProps} = this.props;
        console.log(Component);
        return (
            <Component {...pageProps} name={'jocky'}/>
        )
    }
}

export default myApp
```
#### 固定Layout
```javascript
import React from 'react'
import App from 'next/app'

class Layout extends React.Component {
  render () {
    const { children } = this.props
    return <div className='layout'>{children}</div>
  }
}

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    )
  }
}
```
### 自定义document
&#8195;&#8195;``_document``文件只会在服务端渲染的时候才会被调用，是用来修改服务端渲染的文档内容，一般来配合第三方``css-in-js``方案使用  
```javascript
import Document, {Html, Head, Main, NextScript} from 'next/document'
import React from "react";

export class MyDocument extends Document {
    // 不必重写该方法，重写了就必须执行Document.getInitialProps方法
    static getInitialProps = async () => {
        const pageProps = await Document.getInitialProps();
        return {
            ...pageProps
        }
    };
    // 不必需重写render方法，重写了就必须包含Html、Head、Main、NextScript等标签
    render() {
        return (
            <Html>
            <Head>
                <title>自定义document</title>
                <style>{`
                    .test {
                        color: red
                    }
                    `}</style>
            </Head>
            <body className='test'>
            <Main/>
            <NextScript/>
            </body>
            </Html>
        )
    }
}
```
#### styled-components的集成
&#8195;&#8195;``styled-components``的集成要修改``.babelrc``和``_document.js``的配置。
``.babelrc``:
```json
{
  "presets": ["next/babel"],
  "plugins": [["styled-components", { "ssr": true }]]
}
``` 
``_document.js``:
```javascript
import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }
}
```
``test.js``
```javascript
import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
const Span  = styled.span`
    color: red
`;

export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Span>Index</Span>
            </Fragment>
        )
    }
}
```
### lazyloading的运用
&#8195;&#8195;在next中，pages下的所有页面都被切割成了不同的模块，当我们访问某个页面的时候才会去加载这个js文件，所以大部分时候这个功能已经够用了。但是我们仍然希望自己能够去控制某些模块的lazyloading。
#### 异步加载模块
```javascript
import React, {Component, Fragment} from 'react'
class App extends Component {
    static getInitialProps = async () => {
        // 执行到该行的时候才会去加载moment
        const moment = await import('moment');
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    name: 'ainuo',
                    // 使用的时候使用default方法
                    time: moment.default(Date.now() - 60 * 1000).fromNow()
                })
            }, 2000)
        });
        return await promise
    };

    render() {
        const {name, time} = this.props;
        return (
            <Fragment>
                this is {name}, {time}
            </Fragment>
        )
    }
}

export default App
```
#### 异步加载组件
```javascript
import React, {Component, Fragment} from 'react'

import dynamic from 'next/dynamic'
// 这里其实是es2019Api的dynamic引入
const Comp = dynamic(import('../components/comp'));

class App extends Component {
    static getInitialProps = async () => {
        // 执行到该行的时候才会去加载moment
        const moment = await import('moment');
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    name: 'ainuo',
                    // 使用的时候使用default方法
                    time: moment.default(Date.now() - 60 * 1000).fromNow()
                })
            }, 2000)
        });
        return await promise
    };

    render() {
        const {name, time} = this.props;
        return (
            <Fragment>
                this is {name}, {time}
                {/*只有当渲染Comp的时候才会去执行改代码*/}
                <Comp/>
            </Fragment>
        )
    }
}

export default App
```
### next服务端渲染流程
![SSR渲染流程](data:image/jpeg;base64,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z/3rr7+qbNmyBDbYhtAGAADgZe6991717NlTJUuW1FNPPaVSpUpp4MCB8vHx0dq1azVx4kS9+uqrql27do5fY/bs2erWrZvKli2r6dOna+rUqda69PR0nThxQpUrV7aW1a5dW9WrV9eECRPUsGFDhYWFadWqVdb6WrVqaerUqTp48OANNzHJyosvvqgGDRqodevWevPNNyVJ06dPV9u2ba1tnn/+eRUokHE4fOnSJe3bt08jR4601p8/f14RERH6448/5Ovrq9atW3u8xqeffqqAgIBc1wr8FUIbAACAl1m0aJHatm2rtm3bKj09XRMmTFC3bt1UqFAhORwOzZw5U+XKlfN4zOXLlyXJY/7a9dSsWVMHDx5UWlqaKleurLfeestad+jQIU2cOFEfffRRpsctXrxYDRs2tO4fPHhQCxcu1NatWzVkyBCVLFlSI0eOVGBgoCIiIqx5bzdq+/btatCggccyPz8/a26flHHG0T33b//+/Tp9+rTatGmjS5cuWQFtxYoV6tmzp1544QU9+OCDOaoFyC1CGwAAgBdJSUlRp06ddPz4cc2bN0/79u3T/v37VatWLfn4+OjHH3/UhAkTVLVqVZUqVUo1a9ZUzZo1lZiYqEKFCik6Ovq6zz906FA5HA7dc889iomJkZ+fn9Vt0T2HLTExURcvXrTu33XXXVaAc3eV/P333/X3v/9dTz75pMqXL69ly5apaNGikqQvv/xSS5culdPptF43PDzcuu2e03ZloHO5XNZZMykjtElSbGysOnXqpIiICM2bN88jtPXq1UutWrVSnz59VLduXW3ZskVSxly5K5uM/Pjjj4qMjPT4HEJDQ/XCCy9c97MC8gqhDQAAwIvMnz9f33zzjSpXrqz77rtPHTp0UO3atVWwYEFJUlJSknbv3q1Dhw7p4MGDVtv93377TWXKlPnL53efUatSpYrmzJmjgIAA1apVS1LGcMKoqCi1a9dO0dHRateunb788kuFhYVlep5SpUpp6dKlkqTg4GAtX77cY/2FCxe0efNm6/6qVasyzWm7MmBmNadNymiIMmHCBEVERKhz587asGGDte6LL77Q1KlTtWfPHtWrV8/jcXv37tWpU6dUtWpV7dy501p++vRpdevWTY899thfflZAXiG0AQAAeJEePXpYrfOvbP1/tePHj2vbtm3W/X379qlmzZrZfp3y5cvrlVde0fTp0xUSEqKLFy/mqu6rr7sWHBycq+e7UunSpbVkyRKtW7dOQUFB1vJixYpp6NChmjRpkhISErRgwQIdPXpUFy9e1OTJk1W+fHlVqFBB/fv31/PPP69q1appyJAh6tmzpx555JE8qw/4K4Q2AAAAL+Vu/Z+V+vXre9xfu3atOnbsmK3nTU5O1ueff67//ve/+uGHH7Rv374s569dLS4uTsnJyVq7dq0uXryo0aNH35Tw8+233+rMmTMaMmSILl++rEGDBik8PFyzZs3S7NmzJUkFChRQSkqKYmNjFRMTo1atWmnQoEGqXr26WrRo4XEh8h49emjo0KEqUqSIatWqpfbt2+d5zcD1ENoAAAC81KVLlzyup3YtGzdu1MmTJ/X4449n63kLFiyoX3/9VQ8++KC6d+/u0SVSkooXLy5J8vX1VXJysrV8yZIlqlKlig4ePKiXX35Z1apVU7Vq1TR27Ngsh1Be6er1RYoUyfI6bZJUsWJFTZ48WX/7299UpEgR/fTTT+rTp4+GDh1qDQF98skn1aJFCzkcDvXp0+eaZyQl6eGHH9b8+fM1YsQI7d+/X0ePHs30noGbyeFyz+QEAACAV7n6emNXql+/vjU8cv/+/fr9998zXWz7RoWFhXkMc3Q6nerUqZNq1Kih0aNHZ/txVy8LCwvTsmXLrFCWldjYWA0ePFgLFizIcv2RI0eshil/pUOHDlq8eHGm5S6XS9OmTVOVKlX01FNPZeu5gLxAaAMAAPBSSUlJuvPOO294XU45nU75+Pjk6XMCILQBAAAAgNH4KQQAAAAADEZoAwAAAACDEdoAAAAAwGCENgAAAAAwGKENAAAAAAxGaAMAAAAAgxHaAAAAAMBghDYAAAAAMBihDQAAAAAMRmgDAAAAAIMR2gAAAADAYIQ2AAAAADAYoQ0AAAAADEZoAwAAAACDEdoAAAAAwGCENgAAAAAwGKENAAAAAAxGaAMAAAAAgxHaAAAAAMBghDYAAAAAMBihDQAAAAAMRmgDAAAAAIMR2gAAAADAYIQ2AAAAADAYoQ0AAAAADEZoAwAAAACDEdoAAAAAwGCENgAAAAAwGKENAAAAAAxWwO4CAADZl5iYqPXr12vXrl06cOCAzp07p4SEBDmdTrtLM4KPj48CAgJUsmRJ1axZUw8//LCaNWumwoUL210aAAA55nC5XC67iwAAXF9cXJymTZumVatWKTk52e5ybiv+/v4KDw9Xnz59VKJECbvLAQDghhHaAMBwa9as0ZtvvqlLly7J4XDoscceU0hIiP7f//t/KlOmjAICAlSgAAMnJCktLU0JCQk6ffq09u3bp5iYGG3fvl0ul0uFChXSsGHD9NRTT9ldJgAAN4TQBgCGcrlcmjFjhqZNmyZJCg8PV9++fVW2bFmbK7u9nDp1Sh9//LFWrVolSerbt6969uwph8Nhc2UAAGQPoQ0ADHT58mWNHj1aq1evlr+/v9566y2FhITYXdZtLSYmRkOHDlVycrJatmypESNGqGDBgnaXBQDAXyK0AYCB3n//fS1YsEAlS5bUxIkTdf/999tdklc4ePCgBg0apHPnzunZZ5/VkCFD7C4JyNdornR9NFeCG6ENAAyzceNGDRkyRMWLF9e8efNUrlw5u0vyKidPnlTXrl0VHx+v8ePHcwYTsAHNlXKO5kr5E6ENAAwSGxurjh07KiEhQZMmTVLDhg3tLskrbdmyRQMHDlRAQIAWLVqkwMBAu0sC8g2aK2UfzZXgRmgDAIMMGjRImzdvVpcuXTR48GC7y/FqH3zwgT777DMFBwdr4sSJdpcDeD2aK+UNmivlT4Q2ADDE/v371bVrV1WqVEmLFy+Wn5+f3SV5tdTUVHXo0EHHjh3Tp59+qpo1a9pdEuC1aK6U92iulL/42F0AACDDrFmzJEndunUjsN0Cfn5+ioiIkPTnZw/g5pg0aZJWr16tkiVLaubMmQS2PBASEqKZM2eqZMmS+vrrrzV58mS7S8JNRGgDAAP89NNP2rhxowIDA9WiRQu7y8k3WrZsqdKlS2vDhg06fPiw3eUAXmnjxo1asGCBihcvrrlz59INNw/df//9mjt3rooXL67PPvtMMTExdpeEm4TQBgAGWLx4sSSpS5cuDG+5hQoWLKguXbpIkhYtWmRzNYD3iY2N1ciRIyVJo0aNohvuTVCuXDmNGjVKkhQZGanY2FibK8LNQGgDAJulp6drw4YN8vHxUXh4uN3l5DutWrWSj4+PNm7cyLWhgDw2duxYJSQkqEuXLnTDvYkaNmyoZ599VgkJCRo7dqzd5eAmILQBgM327NmjP/74Qw8++KACAgLsLiffCQgIUJ06dXT+/Hnt2bPH7nIAr7F//35t3rxZlSpVUv/+/e0ux+u98MILqlSpkjZv3qwDBw7YXQ7yGKENAGy2YcMGSWJivo3cn737uwCQezRXurVoruTdCG0AYDP3xHFCm33cn/3GjRttrgTwDjRXsgfNlbwXoQ0AbHThwgUdP35cJUqUUOXKle0uJ9+qXLmyihcvruPHj+vixYt2lwPc9miuZA+aK3kvQhsA2OjIkSOSpKpVq9pcSf7mcDis78D9nQDIGZor2YvmSt6J0AYANvr5558lSdWqVbO5Eri/A/d3AiBnaK5kL5oreSdCGwDY6L///a8k7znTlp6ersjIyEy/7l66dEkjR45USkqKTZX9NUIbkDdormQ/mit5nwJ2FwAA+dmxY8ckybj5bMuXL9eYMWOyvf3OnTslSadPn9Z3330nHx/P3wTnz5+vlJQU3XHHHXlaZ16qVKmSJOn48eM2VwLc3miuZL+QkBBNnDhRGzdu1ODBg+0uB3mA0AYANrpw4YIkGTeEqHXr1mrVqpUk6dFHH9XGjRt15513WuuzWiZlBJ6rzxqePHlSixYt0vz58+V0OtWzZ0+98847KlWq1M1/IzfA/R24vxMAN47mSma4urlSkSJF7C4JucTwSACwkbtTYeHChW2uxJPD4ZCvr698fX0lST4+Ptb9rJZJUvfu3TVo0CDt2rVLwcHBCgoKktPp1OjRo9WlSxeVK1dOPj4+at26td577z3b3tu1uL8DukcCOUdzJTPQXMn7cKYNAGxkamjLiTlz5igyMlL16tVTaGiomjdvrnfeeUc7duxQenq6vv32W124cEGJiYlKSEjQnj17VKdOHbvLthDagNyjuZI5qlWrpp07d+rnn382al+LnCG0AYCNvCm0SRkX1P3HP/6h2NhYlStXTk888YSqV6+uChUqqFSpUipRooSKFSumr776SrNmzdKkSZPsLtniHj5EaANyzhubK40ePVqRkZEec3UvXbqkd955R0OHDjV2ri7NlbwLoQ0AkElQUJDH/UaNGmXa5splvXv31nPPPadz586pUqVKWr9+ve6991498sgjeuSRRzI9NiwsTM2aNcv7wgHYiuZK5qC5knchtAGAjYoUKaL4+HglJibKz8/P7nIs7gOW1NRU1a9fX99//701d03KCHWbNm1SoUKFrGV79uxR0aJFdfHiRW3bts0KfkFBQSpdurTH858/f17btm27Be8k+9xn2JiwD+QczZXMQXMl70JoAwAb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Dw9X37595XK5lJaWJl9fX+sxKSkpOf4McHsjtAFAHvn3v/+tadOmacKECVqzZo18fX3Vvn17/fLLL9Ywxux4/PHHVa1aNQUEBGjChAlavHix+vXrp2eeeUaDBg2SJDkcDj300EP6+OOPJUkjRozQsmXLVK9ePbVs2VJLly7VoEGDNGXKFOt5d+7cad0eNWqUypUrp169euXovf7VhP9Lly5p5cqVmjNnjqSMwNitWzdNmjRJ48eP12+//aa6detq9OjRuuuuuyRJ33//vSZMmKAjR46odOnSeu2116wzeOfPn9eYMWO0detWlSpVSm3bttWUKVO0bds2+fn5KTU1VRMmTFBUVJQuX76skJAQvfbaaypSpIjmzJmjlStX6s4779Trr7+ukSNHXrf2o0ePyul0Ki0tTZ07d9b48eNVsWJFa31MTIxatmwpSdq9e7feeecdTZs2zSPIAcg+p9OpuLg4j33U1YKCgq7ZxCM73njjDdWuXds6Y9auXTsdO3ZMP/zwg7Zt25ZpDtrVPvnkE4/hj+6h5ZL08ssvS5Jmz55t7c/cHnzwQSUmJmrNmjWaN29epnWSVL16dc2cOdOqzS0lJUV+fn4ejyG05V+ENgDIIyNGjNC4ceO0Y8cONWjQQH369FHLli31n//8Rx06dLjm49xz26Q/h/zce++9kiQfHx916tRJjz76qHbt2mVt1759e0meQ/XWr1+vMmXKaP/+/fr999/VtWtXlShRQr1799b06dOt7dLT07Vp0ya98847130/oaGhHo1VrhweefUctqyGDNasWVPVqlXLtHz69OlKS0vTiy++qHfffdcaPpmYmKjhw4frnnvu0eTJk/XWW29ZQw8jIyOVlJSklStXyuVyWUNO3d544w2dOHFCixYt0h133KGhQ4fq/fffV2RkpDp06KD/+7//U+vWrVWjRo1MQyGvxc/PT61bt9ZLL72kTz/91Dp4mjVrlpo3b67//e9/Gjx4sNq3b09gA26hrIZjX2tOmyT985//tPaZbl9++aW1Tzt37pzatGmjCxcuWEPNFy9erOTkZB08eFDJycmKjo7WjBkzVLJkSW3cuFHffvvtNX8A+u2336wffX766Sf5+fmpQIECVjBMTk5Wenq6ChcurHfeeUcPPfRQpuf417/+pV27dunSpUseP5LFx8czPDKfIrQBQB5xOBweQ18aNWqk2bNn6z//+Y813+FagoKCVLp0aUkZ8+Di4uKs+1LGmaYrQ5K74+T58+f1zTffaMGCBZo8ebKmTp2qsLAwhYWFWRPXr7ZlyxadP39eL7zwgkqUKOGx7ty5c3rppZf09NNPa926ddqzZ4/q1Kmj4ODg6w6P/Pzzz63b7gn/AwcOzLRdv379rNfs1q2bxowZY617/PHHlZycrCNHjqhIkSLWgc+FCxe0efNmzZs3T6VKlZIk9erVy2oAEh8fr9WrV2vBggUKDAyUJHXp0kVDhw5VZGSkChUqpEKFCnnU8fTTT3sMOXJLS0vz6ObZpUsXbd26VYcOHbKGpxYpUkRvvPGGNm3apM6dO+f4bCUAT391Bt8tq3lrfzWnzT308MKFCwoPD/doBuIezt60aVPr9u+//64OHTrosccek5+fnx588EHrv/WzZ8/K398/049VCxcuVIcOHRQXFyeHw6Fhw4apevXqat26tSZMmGANxxw2bJjuv/9+denSRVLG/nPu3LlWbVLGmb2SJUuqSZMm+vrrr60fjerXr5/p7BvyB0IbAOShAwcO6I477lC1atXUo0cPtWnTRvXq1dOdd9553cf5+Ph4HCy0atXKY17clb8eHzp0SJ988ol+/vlnJSQkKDQ0VB9//LFKly6tqVOnatmyZRowYICSkpJUqlQpFStWTK+//rr1h37hwoWKiIhQdHS0dWZKygg/7dq1U4MGDSRlBJhBgwZpw4YNf/m+9+7dq6VLl+qNN97Qtm3brCGKV7syiN599926dOmSnE6nfHx8NHnyZH311VeqXbu2VZPT6dTp06clZcw1c7vyzNbp06flcrk85qW5Xb58OctOa8eOHdOOHTsyLb963qHD4dCUKVOsMCtlDIXq1auXnn76aQIbkAccDoeKFCly3WY+jRs39pg7GhQUpH//+98e3XKvFhQUpPXr1+uuu+7SqlWrJGUEM/dtN/fZtSvPtFWtWlXr16+Xj4+PGjdurMGDB2vw4MF6++23Vbx4cfXu3VuS9Morr6hJkyZq0aKFJOmll15SvXr1FBISogceeECLFi1S0aJFraZPJ0+e1KZNmzRkyBDr9du3b6/27dtnWduVQyTdw0OZQ5s/EdoAIA9FRUUpMDBQ1apVU+nSpVWhQgWVKVPmhp5jx44dSktLU7t27TzO+rhVqVJFzZo1U0xMjCpWrKhdu3Zp165dWrhwoYYMGWI1H0lJSdH333+v2bNnW3/0d+3apX379mncuHEqUqSIpkyZoiFDhsjlcunNN9/U008/rbJly0rK+DXZfVYsNTVVoaGhuvvuu7VgwQJJ0h9//KFixYpJyrgMgLthx6JFi/TMM8/IxyfzpUAvXrxonfU6evSoSpcuLR8fH504cUJz587V0qVLVbVqVW3btk1r166VJKt5yJkzZ6zbsbGx1nO6a/z666+z/Vk7nc4sQ15W2y1evFgff/yxdRagSpUqeuWVVzRx4kS1bNlSNWvWzNZrAshafHy89aPInDlz1Lx5c5UvX16TJk1St27d5O/vrxYtWngM186NLVu2qEqVKtb9rM60ZeX8+fNas2aN2rVrp/j4eOsC3WPHjrW2ufq6j40aNdLhw4fVpk0bde7cWdHR0erUqdN1w+aWLVvUoEEDpaWlefzoxHy2/I2LawNAHtq/f7/q1KkjKSNEOJ1ORUVF6ezZs9l6/NGjRzVx4kQ1b95cp06d8liXlJSkTz/9VP7+/nriiScUEBBgtbB3d4/85ZdftHDhQi1cuFBffvmlSpQooQceeECSrOvG9e7dW8WKFVPXrl118OBBzZgxQ+PGjVNiYqL69etnvd6hQ4f022+/6cCBA/Lz89O6deuswNahQwd17NjRuuDrkiVL1LZtWx0/flw//vij2rRpk+X7+/DDD5WYmKijR49q9uzZVie3tLQ0SdKpU6eUkJDgMe+sYsWKqlatmiZPnqyEhAT99ttvHhP6AwMD9fDDD+u9995TbGys0tPTdfjwYX3//feZXv/w4cPavn17tr6LHTt2qFOnTlq2bJkmTZqk4cOHW+vatWun9u3bq0+fPlq/fn22ng9A1t577z0dP35cUsZIg+XLl0uS1Q7fz89PZ8+e1YgRI3L1OklJSbp06ZKio6N18uRJpaWlaezYsYqPj8/W491n7O688061a9dOQ4YMUd++fT06zF6tfPnyev311zV27FhNnjxZe/bsUalSpTI1VUlKSlJSUpKee+45LViwQE6nU0lJSR6jNFJTUwlt+Rhn2gAgj6SmpurIkSOqUaOGTpw4oQ8++MDqJDl79mz961//uua8sE6dOmncuHFasWKF6tWrp2HDhik6OlrJycny9/fXlClT9PPPPysqKkrPPfdcjuobP368ChUqZJ1h8vX1Vb9+/dS3b1/5+vpq9uzZHvO81q1bp1atWmn48OFKT0+3LgwuSS+++KJefPHFTK/x3nvvKSws7JqNOWrXrq02bdooJSVFYWFh1vDCKlWqqGPHjnr55ZdVunRpdezYUVu2bLEe9/bbbysyMlLNmzdX9erV1a5dO+3fv986WHr77bc1btw4tW/fXpcvX1bVqlWtTptSRmBNSUlRRESERo4cKR8fnywbkriHRx46dEgDBgxQjx491L179ywPygYMGKCiRYvq1VdfVfPmzRUZGclcE+AGff311/r555+ts1VPPPGEIiMj1b9/fz3xxBOaOnWqOnbsqH/+859q166dFi1apI4dO0ryvA7l9RqRuJ05c0Z169bVq6++qhEjRujzzz/X8uXLFRERocTERPn5+SksLEzp6ekKDw9Xr169dPHiRetsV0JCgrZu3aodO3aoaNGiatq0qd577z398MMP6tWrlwIDA5WSkqLk5GRrX+oOoQsXLlSXLl3UpEkTjR8/XkuXLtUrr7yiRx55RFJGI6aHH35YPXv2VKlSpRQaGiqXy6WLFy9aDVOuvH+jl2DB7c/hcv8rBwAv4z4Av14b6bz03Xff6eOPP9bbb7+tPn36qG3bturatavOnDmj7t27a9myZbp8+bIcDoeaNWumbdu2acWKFZo6dapSU1MVEhKiNm3aWJ3ERo4cqZiYGGt+V3p6ugYOHGgdqNSrV8+6lMAvv/yi7777TmFhYR4tp93Lly1bpunTp2vu3LkqWLCgYmJitHr1ap0+fVrPP/+8kpOT9dFHH6lGjRpq3ry56tatq379+undd99VsWLFNHfuXG3dulXnz5/3CHYul0vp6elKT09XxYoVdeLECc2ePTtT10h3y/9NmzZlagqSEytXrtRHH32k1atXZ2v77777Ti+88IKGDRumNm3aqG7dutacttTUVPn4+Oj06dNq3769dSbu2LFjqlSpkpKTk+V0OnXy5El17NhRW7du9Qhnu3fv1pYtW9S/f/9cv6/suNX/rnHr5afv+NSpU4qLi7NGBDidTh07dkxVqlSRy+VScnKydbZpy5Ytuueee6yGQ38lPDxcCxYs8LhWpPu6ilcO73ZLTU215tgWLFhQoaGhSkxM1DPPPKP7779fr7/+uh544AG1atVK4eHh8vPz04ULFzR//nxt27ZN8+bNU1hYmOLi4tSmTRv94x//0DPP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/+R4e3tr3bp1ypcvn7nPMAzZbLa7+ryc1q1bZ34ezh6yBQsWmM87HA7VrFnT3N67d6/5uEqVKqpSpYq5HRAQoCVLligqKkotW7aUlPRZAgCQVZjTBgD3aObMmapfv77OnDkjSYqPj9fs2bPVuHFjvfTSS2rUqJHmz5/vsihIaGio3nvvPb300kt66623FBISIkkKCgpSUFCQ8uTJo6CgIElSo0aNdOjQId26dUtXrlzR1KlT1blz53TrdOjQIf3666/q37+/du7cqZ07d+qxxx7Td999p507d6pcuXIaPny4Tp06pdjYWM2YMUPfffed/vzzT/33v/9N9ZiLFy+Wn5+fLC696gAAIABJREFUevTooT/++MMloKXm9OnTcjgciouLU6tWrczPx+nHH380Hx88eFBt2rRRdHR0usdMi5+fn/bu3au9e/eqSJEiWrdunbntDGg7d+502d66dasaNmyod9991+VYjRo10po1a1SgQAGtWbMm1cDmcDhUu3Zt81+9evUkyWUfAAD3Cz1tAHAP1qxZo3Xr1mn+/Pl68sknJUnjxo3T0aNHNWXKFJUpU0ZHjx7VoEGDlJCQYM5Hu379uoYNG6ZnnnlGM2bM0Pjx483hgU5ffvmlOVRPkt577z3zsXM+2qJFi1LMO5OkJUuWqFy5cmZQioyMlIeHh8u8tddee02lS5eWh4eHfv31V7Vv314tW7bU8uXL1aRJkxTHfPfdd/X222+rSZMmKleuXIqhkGlxd3dXkyZN1K9fPy1btsysw8KFC1W/fn399ddf6tu3r1q0aOHS8/ZPa9CggRo0aJAiYDl715L3tE2aNMmljN1uN0O19PfwyOT7GB4JALhfCG0AkElBQUGaPXu2Zs2apaefflpSUjjavHmzFi5cqGeffVaSVKlSJXXv3l0zZswwQ1utWrV069YtnTx5Unnz5tW5c+eUkJCgq1ev6tixY7p165aCgoI0f/58FSpUSDt37tQPP/ygkSNHZqhu3bp1k2EYZtg4duyYKlSo4FKmQYMGkpICx7hx4/Tpp59KSgqdcXFxKY7p4eGRYuGV5s2bp7rQRkJCgtatW2dut23bVrt379bx48dVqVIlSVLevHk1duxYBQcH67333lOXLl0y9N7uxDlUM7PuNBQyMTFRbm5u93QOAADuBqENADJp2rRpql+/vksYunDhggzDUJky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kPT3MFMpaehnrly5tH37dnl5eSkwMFAOh0NnzpxRqVKlVKNGDTOYVa9eXQEBATpz5oxKlixpHuPIkSP66aefNHLkyFTrevjwYQ0fPlxDhgwhsGUThDYASMWlS5c0cOBADR06VL6+vi7DYG4f0hMdHa2goCDFxcWlOiwnJibGZV9MTIxCQ0Pv+GXlfti0aZMqV65sBjYp6epqRq+E3y/Jr2jv37//juXDw8PVrVs3rVu3LtXhUxktI0m//fabOnTooODgYJ08edK8am2z2eTp6amaNWuqb9++mR4iBTxq1q1bp9OnT2vcuHE6f/68GjRooLZt22r9+vWKjIzU1q1bVaRIEc2fP18xMTFq1qyZmjVrJikpnAQFBcnPz08LFy40e9rGjx+vwYMHS5JGjBjhcr4XXnhBUlLAuXXrlho2bJiiTpcuXVJgYGCKnjtvb2+XnqhLly5lqA3KiOjoaDVu3Fjh4eHy8vJSbGyshg0bph9++EH9+/eXp6en6tatq3/9618urwsMDDTb5OjoaPn6+mrnzp3m8+fPn08x92zixIm6fPmypkyZkqIely5d0ocffqiBAwfq1VdflWEYZlB0c3NLUX7Pnj3q16+fevbsqcaNG9/z54AHg9AGAKkoX768Jk2apJUrV8rX19dlGEy9evW0fft2s2zyoTx2u93lj29iYqJefPFFl333OiQnIxwOh+rWravr16/Lzc3NrGNQUJACAwMVFhamtWvXmuW/+uorlSpV6p7PGxYWpt69e2v16tUuQ3KWLFmiDh06KCQkJEPH8fLy0oYNG9I97u1l7kZwcLBy5cql06dPa9SoUfL390/1yxAAV3FxcZo7d64OHjwof39/vf/++ypbtqy6d++uypUrq1q1ajp58qSKFCmikydP6pVXXsnQcbdv326GttGjR0uSFi5cqKVLlyouLk4hISGKiYnR448/rgULFujxxx83g88vv/yiMWPGqEiRIoqPj3c5rt1uN3ulpKSeqftl6tSpevXVV9WwYUNt3rzZ3F+xYkXNnj1bx44d03vvvXdfznPixAnNnj071ee9vLw0bdo0de/eXf3799fFixeVkJCQ5vH69eungQMHEtiyGUIbAKShSpUqqlKlirkdEBCgJUuWKCoqSi1btpSUNJ/AigzDUFRUlBmSEhMT5ePjowMHDsjDw8MlPNWqVUs5c96fPwdR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WucILffee2+xDGK32Wx69NFHdeXKFXl6ehr1fvXVV0pISNDx48f1ySefGPsvXbpU99xzT57Pn5vjx49r1KhRWrFihdN4kEWLFikyMtJpAoBbCQoK0qeffnrL4968T35s27ZN3t7eSkxMVHR0tKKiojRnzpwCHQtA4fvpp5+UkJCgsWPHSpIGDBhwy/2rVKmilStX6u6775Z0Y4KRoUOHqm3btk77TZw40WnZEZ5uDlL5aTU7ffq0AgMDja6Rt1OhQgWncWvt27fP87lQ9hDaACAHDz74oB588EFjOT4+XosWLXL6hV4Yg8SLehC73W7XxYsXjZCUmZmpkJAQ/fDDD/Lx8XEKT23btpWHR+H8Wrh48aKOHz9eKMcq6uO6ubnp3nvv1d/+9jeNGjUqW2sqANf59ttvdfnyZWN5yZIlOe7n+IPUv/71L40fP95pW0pKimw2mx566CF5eXmpQoUKTtsdodDf31/PPfec3njjDe3fv19hYWH5agnbvHmzPD09deDAATVs2PC2+9PShvwgtAFAFp9//rnmzp0rf39/rVixwljfuXNnde7cWe3bt881rNlsNqeWN4ec1jkU1yB2x/EzMzMlSRs2bMg2ni0jI8PoPpSSkqJp06bp22+/VWBgoP76179q3rx5Rq1paWl66623lJCQoPT0dIWGhmrixIlGV1BH10NH7bl1hXR0WXznnXc0d+5c/frrr6pVq5aio6NVv359py6NPj4+OR735n12796tt956S0ePHlXVqlU1ceJEp9cwN9evX1e5cuXk5uZmHDMqKkpvvfWWOnfurBdffFHp6en6v//7P8XHx+vcuXOqXLmy/vrXv2rIkCFOj4uJidE//vEPnTx5Us2aNdPUqVNVsWJFSdLy5cv1/vvv69KlS+rZs6defPHF29YGlFW7du1yal178sknb7l/o0aNlJCQYCx/8skn+uOPPxQTE6NRo0Zp/vz5mjx5stM14erVq3r11VeNmSkDAgK0ZMkSffnll0aLXW7++c9/ytPTUz/88IM++ugjRUZGavr06XJ3d1f//v3VoUMHbdq0KcfH0tKG/CC0AUAWHTt2VMeOHbMFrZy6zsyaNctpHzc3N3311VfGsqN7ZNZ1Wcd05WT06NHavXu33N3d7+h53M7LL7+sOXPmKDMzU2FhYZJu1OsId1FRUfrjjz+0bt062e12jRs3zunxr776qn7//XctX75cf/rTnzRhwgTNnj1bUVFRkpy7Qd5qumyH1atXKyYmRl5eXnrllVc0bdo0Y/KBrPJy3CtXruiVV17Rfffdp9jYWM2cOVNr167N9dw2m00///yz3nnnHT3xxBNO27777jvjNZCk6dOn69ChQ5ozZ46Cg4N16NAhvfTSS8rIyDCmHJektWvXKi4uThkZGRo9erRmzZql6dOn6/fff9esWbM0f/58NWjQQL/99tttXxugrDp37pwOHz6sFi1aSJJeeumlHGeAlKQvvvjCafno0aOaO3euWrVqpYEDByomJkYDBgxQxYoVNW7cOHXu3FmDBw9WtWrVtH37doWGhqp69erKzMyUv7+/YmJiNG3aNNWvX/+WNWZmZuq1115TQkKCJk6cqI4dO2rw4MHatWuXFi1apHnz5umpp55Sjx498nQtBHJDaAOAPLhdV8jMzEynQe4FUZSD2G8OoW5uboqIiNDw4cNVv359BQUFKSMjQ15eXkpOTtb27du1ePFiBQYGSpKGDRum559/XpKUnJys+Ph4ffzxxwoKCpJ0Y5zJhAkTjNCWX88995xxrr59+2rkyJEFnoGtbdu2unbtmo4ePSo/Pz+dPHlSGRkZOe7bpk0bubm5qWbNmurdu7fTpAfSjfEwjolhUlJStH79ei1cuFB//vOfJd34q/6zzz6r2NhYp9A2fPhwBQQESLrR6jht2jRJkqenpywWi86cOaPmzZvrgQceKNBzBMqCL7/8Uk2aNJGPj4/RNXzevHm57v/jjz/qiSee0Jw5c3Ty5ElNnjw5WzfFrl27qnnz5oqLi1Pv3r3VpEkTzZ49W5UrV9ajjz6q++67T5J011136dixY3rqqadyPFdiYqJGjx6ts2fP6rHHHtOyZcucWuVatGihFi1aaP/+/Zo/f742bdqk9957TzabzXguGRkZTl3eb14GsiK0AcAt2Gw2o9WrZ8+exs8VK1ZUXFycsd/169eVlpaWY/eWvHZ5KcpB7I7WPkfrnyQFBwerd+/eeuONNzRr1iwjeCYmJkqS04QkWWdUPHPmjOx2e47dlNLT0wsUXitXrux0LrvdnmvQup3Y2FitXbtWjRo10p/+9CdJuU8m4OhSmZsaNWoYP58+fVp2u13BwcFO+9SqVUsXLlxwOkfVqlWNn6tUqaKrV6/KZrMpKChI06ZN09y5c7VkyRJNmDBBTZo0KdDzBEq7Rx991BhbvHr16jw9JiMjQ4899pg6dOiQa4+FqlWr6pVXXtGYMWN06tQpeXp6ymq1ZmutmzlzptMMux07djR+vueeezRu3Lhss/LerHHjxlqwYIGSk5MlSXFxcbftcSFJ+/fvv+0+KFsIbQBwE5vNJpvNpvfff1/lypUzAsv169e1fv16SVKnTp2cHpOamqp69eoZN3iV/heQss42eatf1q4YxD5o0CCdO3fOaOXz9PQ0xqWdPXvW+DkpKcl4jKMFacOGDapWrdodnb+w/f7771q0aJFWrVql4OBg7dy5Uxs3bizw8bIG6CpVqki68Rf2Bg0aOJ0zKCjIqYX08uXLxhe5xMREVa1a1djeqVMnPfroo4qJidG4ceNyncIcKOsCAwONFvi88vDwyHZ9lmSMBc7K19dXdevWzfVYjRs3dlqeMGGC03Jexso6VKpUSdLtu8jndm6A6bEA4CY//vijcf81T09P3XvvvZJujK/o06dPjkHp5MmTtx2wnpObB7H/9a9/1fTp09W/f3/Fx8fLzc3ttoPYHf8KwsvLS3fffbeuXr1qtErVrFlTderUUWxsrFJTU3Xy5EktXrzYeExQUJCaNm2qN998U0lJScrMzNS///1v7d6929jH399fkrRv3z6lpqYWqLac3O64jta506dPKzU1VcuWLSu0cwcGBio8PFzTp0/XL7/8oszMTP30009asGCBBg0a5LTv22+/rStXrigxMVHvv/++unXrZtS1b98+WSwW1axZU2lpacZ4OQAAckNLGwDc5L777jNm9YuOjlarVq0k/e/+PznZt29fgcYnFdcg9pCQkFtu/+WXX4wWNEl6/fXXFRUVpQ4dOqhu3bqKiIjQwYMHjVsCvP7663rttdfUq1cvpaenKzg4WKNGjTIef8899ygiIkKjRo2Sn5+f0ZqUdfbHvNxc+2a5Hdehdu3a6tu3r8aOHauqVauqb9++2rFjR77Pk5upU6fq7bff1ogRI5SSkqIaNWooMjJSvXr1ctqvUaNG6tGjh65fv65OnTpp2LBhkm6831OnTjVC/quvvprn7rAAgLLLYudPfABKEUfXk4IEgpt99913mjx5stasWeM0ZiEjI0MeHh5KSUlRnz59FB8frx49eujtt99W7dq1jf0c3SP37NmjzMxMJScnq3Pnzvruu+90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d+5Uhw4dVLlyZWP/xMREp0CVH8X5fAAAcCC0ASiz0tLS9OOPP+rhhx821l29elUvv/yyfv75Z3l5eal79+6SJLvdrsqVK+carnKyd+9eSdnD3M1++eUXHT58WPXr18/2+BMnTuTpXEOHDlXfvn21YsUK9e3bV+np6fr6669z3d/Rgrh58+Yca8oqa/icN2+eXnzxRZ08eVKBgYHy9/dXVFSURowYoevXr2v06NFasGCBESrr1aunuXPn6vjx4+rUqZMkKSMjQ+PGjZMkvfrqqxo7dqy++uqr2z7H2NhYPfzww+rVq5eCg4NlsViy7VOlShUtW7ZMkozzubu7G+skqWvXrrc9V26K+/kAACAR2gCUYRkZGZo0aZIRxM6cOaMRI0booYce0rPPPqt69epJkq5du6aZM2caX9ILm9Vq1fLly7O1rixbtkxNmjTRjh07bnsMLy8vTZo0KU8tZwW1detWlStXzgga06ZN0xdffKEaNWooLCxM0o1WrCFDhmjOnDm66667tGvXLjVt2lSNGzd2ak3asmWLNm3adMvWyKwSEhK0efNmrVy5Uq+88opSUlL04osvqlGjRk77nTt3Tk8++aQkKSUlRdKNllPHOulGS1hBFffzAQBAIrQBKMN8fHz0+OOPa/HixZKkqlWr6oUXXlCrVq00btw4+fr6ql27dlq9erWGDh2qBx54oEjq6N27t8aOHavRo0erUqVKkqRTp05px44dmjZtWp5CmyQ1adJE0o1WwWvXruUYMs+ePauEhARVrFjRab3ValXVqlWd9nO0FDrExMTIbrfriSeekNVq1aZNm3Tq1CnNmTPH2OeZZ56Rp6en+vXrp08++USbNm3Su+++q7feekuff/653N3d1atXL/36669GN8a8aNu2rerUqSN/f3+99dZbWrFihYYPH64+ffpo1KhRkiSLxaImTZpowYIFkqRJkyZpzZo1evjhh9WlSxetWrVKo0aN0rx58/J83psV5/MBAMCB0AagTOvXr58yMzP1ySefyM3NTa1atdLvv/+uRo0aKT4+Xg0bNtSsWbNks9mKrIamTZv+f+3deVRV5f7H8c85DOEECgpWaoaVaZdrRmo44ICSBGTLyKEMLcyh0qyVTeaUla6rVmoqmZrmfPVqrXC4qV0lvZmmXi3RruHPITVNBk9OHeCc3x8uzvUIOGXuB3i/1nJ59ni+e2+W+FnPs59HdevW1bJly/T0009LkhYtWqTWrVsrLCzsssfPmDHDM2jKN998o1OnTqlatWqaPn26qlWr5umquH37do0aNUo1atRQXl6e1znsdrtXy1GTJk2KfM/UqVN18uRJDRo0SIMGDdL69esVFBTk6UJ6oblz5yokJERDhw7VmDFjtGXLFjVv3lx9+/ZVfHy8du7cqa5du5Z4TYXvgknSN998I0m66667PLV2795dTZs21bZt2zz7JSUlSZLn3TFJWrt2rWrWrKldu3bpxIkTSk5OVnBwsPr06aNp06aVfFNLcCOvBwCAQoQ2AOVacHCwTp065Vn+8MMP5XK51K5dO/Xo0UPS+e51UVFRRVqeWrVqdd3q6N69u1JTU9WzZ085nU59/vnnmjBhwhUdm5KSopSUFEVFRUmSDh8+rJCQEG3ZskVz5szRm2++qYYNG2r06NEaOHDgNb87Vb16dY0YMcLTIvjII49Ikvr161fiMTabTa+//rpnuVWrVpo5c6Z27typ0aNHX/L7Lmz9y8/PV3Z2tldrYG5uricASf8boTE3N1dr1qzR/PnzNWnSJE2ZMkVxcXGKi4tTpUqVrv7CLboeAAAKEdoAlGvnzp3ToEGDPMvLly+XJK9Wp0JxcXEKDw/3hJSSRo+8Fh07dtSkSZP0r3/9Szk5Oapdu7YaNWqk77///qrP9d133ykiIkKPPPKIGjRooCFDhshms+n+++/3vHt2LebNm6d9+/YpMzNTW7duVXJysp577rlip0VIS0vzfM7IyNBNN92kevXqKSUlRY888oiaNWumChUqXPL7Lmz9O3HihBITE72eS2FIlaQ9e/Zo9uzZ2rt3rxwOhzp06KDU1FSFhoZqypQpWrZsmQYMGKCzZ8+qevXqCgoK0rBhwy47CEtxbsT1AABwIUIbgHLrzJkzGjRokO677z5t375d0vmwtmfPHh09elRt27aVdL6lrWnTpp7/YF9LkLocf39/de7cWcuWLVNWVpaSk5Ov6TxOp1NLlizxDGridDplt9sVEBCgH374QYcOHVLt2rWLHOdyubzegSuuO+itt96qRx99VKGhoYqIiFBISIiOHj1apHXo4vCxcuVKhYWFqV69egoNDVWtWrVUs2bNq7quLVu2KD8/X507d/aa86xQ3bp1FRMTo/T0dNWuXVvbtm3Ttm3btGDBAr300kuewUd+//13bd68WTNnzrymwHajrgcAgAsxuTaAcisnJ0eVK1cu0r3Pz89Pb7/9tnbv3n1D63nssce0bds2ZWdnq0OHDiXul5OTo6ysLGVlZXnCSGFr15YtW1S/fn35+vrqlVde0ahRozR48GB9+umnSkxMVK9evfTtt98WOWfPnj21cuVKz5+ePXsW2adt27bq3bu3Hn74Yd13331F3osrya5du9SoUSNJ51syXS6XVq5cWexk4MU5cOCAJkyYoNjYWB09etRr29mzZzVnzhwFBASoffv2CgwM1MKFC7VgwQLP6JH79u3TggULtGDBAi1dulTBwcElDipTUFCgzz77TOfOnbP0egAAuBChDUC5deutt2r8+PGy273/KaxXr55efPFFLVmy5IbWU716dcXExCgpKUl+fn4l7vfwww8rNjZWsbGxevjhh5WTk6O+ffuqVq1a2rRpk15++WX9+uuvat++vRYuXOgZVKRLly56//33PVMZXGjgwIGXXJbOD+rxt7/9TcnJyUpMTFRGRsZlr8npdCozM1P169fXzz//rPfee0/Dhw9XfHy8Zs6cKUklzmnWvXt3jRkzRt26ddPdd9+tIUOGSJInUE2ePFl79+4ttivrtdqzZ4+mTZumgICAMnE9AICyge6RAMq1kgblSEhIUNu2beV0OnX48GHddNNNnm0RERFFBiW5XuvffvvtEvcp6Tzz589XZGSk+vTpo48++kgpKSk6d+6c7Ha7PvjgA9ntdrlcLuXn5ys/P181a9bUrFmzJEnx8fHFXn9xjh8/rvDwcCUlJen222/33LuLJ6u+8B237du3Kzw8XLm5uRowYIB69uypiIgIhYWF6amnntKLL76ovLw82Ww2FRQUSJI+//xzTZkyRU6nU9FUgXU6AAAYNElEQVTR0ZoyZYpnOoMHH3xQDz30kOd5FBQUeAXM7Oxsz5xsF87HdqXztO3YscPTLbY4N/p6AACQCG0AUKKVK1dqzJgx8vHxueRw7lZLSkryvJ81YMAADRgwwLOtoKBABQUFcrvdnj8+Pj6y2+1KSEjQ0KFD5et76V8Fw4cPl5+fn1fwKfTUU0+pT58+XuumT5/u+Xz06FFFRkZq+/bt6tChg+ddvdDQUC1btkz+/v7q1auXMjMzPe/CRUdH6+6779add95ZpBV0xIgRl6z1H//4h2rVqiXp/Fx30vkpEW655RbPPj///HOJx+/YsUNdunQpcfuNvh4AACTJ5na73VYXAQDXS2RkpCQV2yIFlDX8vANA+cA7bQAAAABgMEIbAAAAABiM0AYA5djGjRvlcDg8yy6XS6NGjSpxudDp06f17LPP6scff7yi7zl58mSRdW63W4sXL/YMzX8xl8ulRYsWedUnnX/HDgCA8oTQBgBlREFBgZo1a6bu3bure/funoEwYmNjPeu6d++u5s2be47Zu3ev+vXrp99++03S+SD12WefebZfvFy47q233lJubq5uv/12jRs3Ti1btiz2jyQdPHhQnTt3LnIem82mPXv2aNKkScVeT15eno4dO6bOnTtr3bp1nu/+8ssv/9iNAgCglGEgEgBlSnkemKGgoECdOnVSWlqaJCkuLk4rV670/F0oISHBs48kvfzyy2rdurXef/99SedbxYKCgjzbC5fXrFkju92ucePG6auvvtKsWbMUGhp6RbXt2rVLr7/+usaOHasnn3xSdevWLXa//fv3a/PmzXI4HFq6dKmSkpKUm5urKlWqaMSIEdq1a5dOnTql4OBgSVJWVpa++eabq7pPZUl5/nkHgPKEIf8BoAz59ddfPUPzF3Y7LCgouOQ8ZWPHjpXNZlNiYqIKCgrUtGlTzwTRFy+PGjVK3377rT7++GNt2LBBNWrUUKtWrS5b1z333KPPPvtMdrtdkZGRmjp1arH79e/fX5KUn5+v/fv3q1OnTpoxY4aCgoL0/vvva82aNfr66681cuRISfK0JhYUFMjHx+eK7xMAAKUJoQ0AygibzabGjRsrNTVVkjR06FAtW7ZMzZo1U3x8vBYvXqwXXnhBkydPLnJcoct1vqhfv76effZZORwOjRs3TmPHjr1sXaNHj5bD4dAzzzyj8PBwZWVllTgX2rx58yRJwcHBGjFihDIzM+VwOJSenq7o6GitWLFCMTExRY576aWX9Nprr+nmm2++bD0AAJQ2hDYAKCOSkpIkSZ07d/asW7t2rWrWrKldu3bpxIkTSk5OVnBwsPr06aNmzZrp008/ldPp9HQxdLlcRSaAvlCXLl109uxZ9e/fX/369VOTJk08764VOnv2rCpUqOBZ/uqrr7R06VLNnz9fb775pkJCQkocfOS5557TtGnTJJ2fyPqTTz7Rhg0b9PLLL2v27Nnav3+/YmNjvY45c+aM/u///k/VqlW7irsFAEDpQWgDgDJi6dKlks53i1yzZo3mz5+vSZMmacqUKYqLi1NcXJwqVarkdUxKSoqioqJ07Ngx9ejRQ9L54NahQwev/QqXV6xYocGDByszM1NJSUny9/fXhg0bvPaNjIxUWlqaqlat6lnXrVs3z+effvpJq1evLvYa2rVrJ+l8N8+kpCTFxsZq2bJlmj17tlavXq2IiAj5+fl59k9MTNQTTzyhdu3aKSAg4KruFwAApQWhDQDKgD179mj27Nnau3evHA6HOnTooNTUVIWGhmrKlClatmyZBgwYoLNnz6p69eoKCgrSsGHD5O/vL0kKCwvT6tWr9fXXX2vGjBmaNWuWpP+901YYsvr37+8ZBORq/PDDD1q5cqUGDx4sSZ6AWJIaNWro73//u2699VZJUnJysnr37q22bdt67ffGG29cdS0AAJQ2hDYAKAPq1q2rmJgYpaenq3bt2tq2bZu2bdumBQsW6KWXXvIMPvL7779r8+bNmjlzpiewXWjVqlVq06ZNid/TpUsXtW7dWqtWrbqq+v7973/r1KlTnuW5c+cWu19hS9vOnTv16quvem3Lzc2Vy+XS/fffL39/f68RLiV5jZAJAEBZQmgDgDIgICBA7du31/jx47Vw4UJJ54f8l6R9+/Z5BZq4uDjdc889Rc6xZs0aff/995dsvbq4petKbdq0yat17cLRLIvz17/+1avmJUuW6OzZs5o4caJeeOEFTZ06VcOGDfOMHgkAQFlGaAOAcurUqVMaPXq08vPztXjxYn355ZeaMGFCkffersSZM2cUEBCgX375RZK8ht//9ddftXv3bj3wwAOSpNdee63YESCl88HxQpmZmZowYYKaN2+uJ598UhMnTlSPHj1UtWpVvfLKK3rooYf01FNPqWbNmlddMwAApQWhDQDKkOzsbE8r1oXzsRU3T9sXX3whp9OpRYsWacaMGTp06JD69esnHx8f+fr6ytfXV/n5+QoLC1P79u1122236eOPPy52dMl33nnH02WyWbNmqlKlimfb2rVr1bhxY1WsWNEzsuXF0w5caPv27eratavee+89HT58WMOGDVNERITXPgkJCWratKmmTZumxx57TI0bN9b48eO9BikBAKCssLkvNykPAJQikZGRkqStW7daXIk1fv75Z9WqVUuSdOTIEd1yyy2evy/ex+l0ytfXt0gIKygo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)
