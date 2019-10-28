import {withRouter} from 'next/router'
import Repo from './repo'
import Link from 'next/link'
import {request} from '../lib/api'
import {get, set} from '../lib/repo-basic-cache'
import {useEffect} from "react";

const produceQuery = (queryObj) => {
  const query = Object.entries(queryObj)
      .reduce((res, entry) => {
        res.push(entry.join('='));
        return res
      }, []).join('&');
  return `?${query}`
};
const isServer = typeof window === 'undefined';
export default function (Comp, type = 'index') {
  const withDetail = withRouter(({repoBasic, router, ...rest}) => {
    const queryStr = produceQuery(router.query);
    useEffect(() => {
      // 设置缓存
      if (!isServer) {
        set(repoBasic);
      }
    });
    return (
        <div className="root">
          <div className="repo-basic">
            <Repo repo={repoBasic}/>
            <div className="tabs">
              {
                type === 'index' ? <span className={'tab'}>ReadMe</span> : (
                    <Link href={`/detail${queryStr}`}>
                      <a className={'tab index'}>ReadMe</a>
                    </Link>
                )
              }
              {
                type === 'issues' ? <span className={'tab'}>Issues</span> : (
                    <Link href={`/detail/issues${queryStr}`}>
                      <a className={'tab issues'}>Issues</a>
                    </Link>
                )
              }
            </div>
          </div>
          <div className="ReadMe">
            <Comp router={router} {...rest}/>
          </div>
          <style jsx>
            {`
            .root {
              padding-top: 20px;
            }

            .repo-basic {
              padding: 20px;
              border: 1p solid #eee;
              margin-bottom: 20px;
              border-radius: 5px;
            }

            .tabs .tab {
              margin-left: 20px;
            }
          `}
          </style>
        </div>
    )
  });
  withDetail.getInitialProps = async (context) => {
    // router.query的信息不会实时更新，ctx会实时更新
    const {ctx} = context;
    const {owner, name} = ctx.query;
    // 得到包裹的组件的getInitialProps的内容
    let pageProps = {};
    if (Comp.getInitialProps) {
      pageProps = await Comp.getInitialProps(context)
    }
    // 拼接fullName
    const fullName = `${owner}/${name}`;
    // 如果缓存中由这个repo则直接返回缓存中的repo
    if (get(fullName)) {
      return {repoBasic: get(fullName), ...pageProps || {}}
    }
    // 缓存中没有，则请求接口
    const repoBasic = await request({
      url: `/repos/${owner}/${name}`,
    }, ctx.req, ctx.res);
    return {repoBasic: repoBasic.data, ...pageProps || {}}
  };
  return withDetail
}
