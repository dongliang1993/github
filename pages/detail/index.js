import dynamic from 'next/dynamic'
import withRepo from '../../components/withRepoBasic'
import {request} from '../../lib/api'
import Loading from '../../components/loading'
import {useEffect} from "react";

const Markdown = dynamic(() => import('../../components/markdownRender'), {
  loading: () => <Loading/>
});
const interval = 1000 * 60 * 10;
const isServer = typeof window === 'undefined';
let readMeCache;
const Detail = ({readMe, router}) => {
  useEffect(() => {
    if (!isServer) {
      readMeCache = readMe;
    }
    const timer = setTimeout(() => {
      readMeCache = null;
    }, interval);
    return () => {
      clearTimeout(timer);
      readMeCache = null;
    }
  }, [readMe]);
  return (
      <Markdown content={readMe.content} isBase64={true}/>
  )
};
Detail.getInitialProps = async ({ctx}) => {
  if (readMeCache) {
    return {
      readMe: readMeCache
    }
  }
  const {owner, name} = ctx.query;
  const readMeRes = await request({
    url: `/repos/${owner}/${name}/readme`
  }, ctx.req, ctx.res);
  return {
    readMe: readMeRes.data
  }
};
export default withRepo(Detail, 'index')
