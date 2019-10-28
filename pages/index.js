import {useEffect} from 'react'
import {Button, Icon, Tabs} from 'antd'
import getConfig from 'next/config'
import {connect} from 'react-redux'
import Router, {withRouter} from 'next/router'
import {setArray} from '../lib/repo-basic-cache'
import Repo from '../components/repo'
import BaseCamp from '../components/baseComp'

const api = require('../lib/api');

const {publicRuntimeConfig} = getConfig();
// 页面缓存
let cachedUserRepos, cachedUserStaredRepos;

const isServer = typeof window === 'undefined';
// 缓存时间
const interval = 1000 * 60 * 10;

function Index({userRepos, userStaredRepos, user, router}) {
  const tabKey = router.query.key || '1';
  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`)
  };
  // 设置页面缓存的effect
  useEffect(() => {
    if (!isServer) {
      cachedUserRepos = userRepos;
      cachedUserStaredRepos = userStaredRepos;
      const timeout = setTimeout(() => {
        cachedUserRepos = null;
        cachedUserStaredRepos = null
      }, interval);
      return () => {
        cachedUserRepos = null;
        cachedUserStaredRepos = null
        clearTimeout(timeout);
      }
    }
  }, [userRepos, userStaredRepos]);
  // 设置整体缓存的
  useEffect(() => {
    if (!isServer) {
      // 非服务端设置缓存
      userRepos && setArray(userRepos);
      userStaredRepos && setArray(userStaredRepos);
    }
  });
  if (!user || !user.id) {
    return (
        <BaseCamp titleTips={'亲，您还没有登录哦~'} forwardTips={'点击登录'} forward={publicRuntimeConfig.OAUTH_URL}/>
    )
  }
  return (
      <div className="root">
        <div className="user-info">
          <img src={user.avatar_url} alt="user avatar" className="avatar"/>
          <span className="login">{user.login}</span>
          <span className="name">{user.name}</span>
          <span className="bio">{user.bio}</span>
          <p className="email">
            <Icon type="mail" style={{marginRight: 10}}/>
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </p>
        </div>
        <div className="user-repos">
          <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
            <Tabs.TabPane tab="你的仓库" key="1">
              {userRepos.map(repo => (
                  <Repo key={repo.id} repo={repo}/>
              ))}
            </Tabs.TabPane>
            <Tabs.TabPane tab="你关注的仓库" key="2">
              {userStaredRepos.map(repo => (
                  <Repo key={repo.id} repo={repo}/>
              ))}
            </Tabs.TabPane>
          </Tabs>
        </div>
        <style jsx>{`
        .root {
          display: flex;
          align-items: flex-start;
          padding: 20px 0;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
        }
        .user-repos {
          flex-grow: 1;
        }
      `}</style>
      </div>
  )
}

Index.getInitialProps = async ({ctx}) => {
  // 从store里面得到user
  const user = ctx.reduxStore.getState().user;
  if (!user || !user.id) {
    return {
      isLogin: false,
    }
  }
  if (!isServer) {
    if (cachedUserRepos && cachedUserStaredRepos) {
      return {
        userRepos: cachedUserRepos,
        userStaredRepos: cachedUserStaredRepos,
      }
    }
  }
  // 用户自己的仓库
  const userRepos = await api.request({url: '/user/repos'}, ctx.req, ctx.res);
  // 用户关注的仓库
  const userStaredRepos = await api.request({url: '/user/starred'}, ctx.req, ctx.res);
  return {
    isLogin: true,
    userRepos: userRepos.data,
    userStaredRepos: userStaredRepos.data,
  }
};
const mapStateToProps = state => ({
  user: state.user,
});
export default withRouter(connect(mapStateToProps)(Index))
