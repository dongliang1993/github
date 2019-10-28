/**
 * Created by 16609 on 2019/9/30
 * 重写_app，让其一开始就加载全局的css样式
 */
import App from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../components/layout'
import MyContext from '../lib/my-context'
class myApp extends App {
  state = {
    context: 'value',
    count: 1
  };
  setContext = newContext => {
    this.setState(() => ({context: newContext}))
  };
  render() {
    // 这个Component即渲染的页面
    const {Component, pageProps} = this.props;
    return (
        <MyContext.Provider value={{context: this.state.context, updateContext: this.setContext}}>
          <Layout>
            <Component {...pageProps} name={'jocky'} {...this.state}/>
          </Layout>
        </MyContext.Provider>
    )
  }
  // 这里方法在每次切换页面都会执行
  static getInitialProps = async ({Component, ctx}) => {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {pageProps}
  };
}

export default myApp
