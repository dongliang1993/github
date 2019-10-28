import {useState, useCallback, useEffect, Fragment} from 'react'
import {Avatar, Button, Select} from 'antd'
import dynamic from 'next/dynamic'
import LRU from 'lru-cache'
import Loading from '../../components/loading'
import {getLastUpdatedTime} from '../../components/repo'
import withRepoBasic from '../../components/withRepoBasic'
import SearchUser from '../../components/searchUser'

const MdRenderer = dynamic(() => import('../../components/markdownRender'));

import {request} from '../../lib/api'

const cache = {};
const issuesCache = new LRU({
  maxAge: 1000 * 10 * 60
});

function IssueDetail({issue}) {
  return (
      <div className="root">
        <MdRenderer content={issue.body}/>
        <div className="actions">
          <Button href={issue.html_url} target="_blank">
            打开Issue讨论页面
          </Button>
        </div>
        <style jsx>{`
        .root {
          background: #fefefe;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
      `}</style>
      </div>
  )
}

function IssueItem({issue}) {
  const [showDetail, setShowDetail] = useState(false);

  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail)
  }, []);

  return (
      <div>
        <div className="issue">
          <Button
              type="primary"
              size="small"
              style={{position: 'absolute', right: 10, top: 10}}
              onClick={toggleShowDetail}
          >
            {showDetail ? '隐藏' : '查看'}
          </Button>
          <div className="avatar">
            <Avatar src={issue.user.avatar_url} shape="square" size={50}/>
          </div>
          <div className="main-info">
            <h6>
              <span>{issue.title}</span>
              {issue.labels.map(label => (
                  <Label label={label} key={label.id}/>
              ))}
            </h6>
            <p className="sub-info">
              <span>Updated at {getLastUpdatedTime(issue.updated_at)}</span>
            </p>
          </div>
          <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
        </div>
        {showDetail ? <IssueDetail issue={issue}/> : null}
      </div>
  )
}

function makeQuery(creator, state, labels) {
  let creatorStr = creator ? `creator=${creator}` : '';
  let stateStr = state ? `state=${state}` : '';
  let labelStr = '';
  labelStr = labels && labels.length > 0 && `labels=${labels.join(',')}`;
  const arr = [];
  creatorStr && arr.push(creatorStr);
  stateStr && arr.push(stateStr);
  labelStr && arr.push(labelStr);
  return `?${arr.join('&')}`
}

function Label({label}) {
  return (
      <>
      <span className="label" style={{background: `#${label.color}`}}>
        {label.name}
      </span>
        <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px 10px;
          border-radius: 3px;
          font-size: 14px;
        }
      `}</style>
      </>
  )
}

const isServer = typeof window === 'undefined';

const Option = Select.Option;

function Issues({initialIssues, labels, owner, name}) {
  const [creator, setCreator] = useState();
  const [state, setState] = useState();
  const [label, setLabel] = useState([]);
  const [issues, setIssues] = useState(initialIssues);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!isServer) {
      issuesCache.set('issues', initialIssues)
    }
  });
  useEffect(() => {
    if (!isServer) {
      cache[`${owner}/${name}`] = labels
    }
  }, [owner, name, labels]);

  const handleCreatorChange = useCallback(value => {
    setCreator(value)
  }, []);

  const handleStateChange = useCallback(value => {
    setState(value)
  }, []);

  const handleLabelChange = useCallback(value => {
    setLabel(value)
  }, []);

  const handleSearch = useCallback(() => {
    setFetching(true);
    request({
      url: `/repos/${owner}/${name}/issues${makeQuery(
          creator,
          state,
          label,
      )}`,
    }).then(resp => {
      setIssues(resp.data);
      setFetching(false)
    }).catch(err => {
      setFetching(false)
    })
  }, [owner, name, creator, state, label]);

  return (
      <Fragment>
        {initialIssues.length > 0 ? (
            <div className="root">
              <div className="search">
                <SearchUser onChange={handleCreatorChange} value={creator}/>
                <Select
                    placeholder="状态"
                    onChange={handleStateChange}
                    style={{width: 200, marginLeft: 20}}
                    value={state}
                >
                  <Option value="all">all</Option>
                  <Option value="open">open</Option>
                  <Option value="closed">closed</Option>
                </Select>
                <Select
                    mode="multiple"
                    placeholder="Label"
                    onChange={handleLabelChange}
                    style={{flexGrow: 1, marginLeft: 20, marginRight: 20}}
                    value={label}
                >
                  {labels.map(la => (
                      <Option value={la.name} key={la.id}>
                        {la.name}
                      </Option>
                  ))}
                </Select>
                <Button type="primary" disabled={fetching} onClick={handleSearch}>
                  搜索
                </Button>
              </div>
              {fetching ? (
                  <Loading/>
              ) : (
                  issues.length > 0 ? (
                      <div className="issues">
                        {issues.map(issue => (
                            <IssueItem issue={issue} key={issue.id}/>
                        ))}
                      </div>
                  ) : (
                      <div className="no-issues">还没有这样的issue
                      </div>
                  )
              )}
              <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 20px;
          margin-top: 20px;
        }
        .search {
          display: flex;
        }
        .loading {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .no-issues {
                            width: 100%;
                            height: 200px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                          }
      `}</style>
            </div>
        ) : (
            <div className="root">
              还没有人讨论问题呢
              <style jsx>
                {`
                  .root {
                    width: 100%;
                    height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                `}
              </style>
            </div>
        )}
      </Fragment>
  )
}

Issues.getInitialProps = async ({ctx}) => {
  const {owner, name} = ctx.query;
  const full_name = `${owner}/${name}`;
  const fetches = await Promise.all([
    issuesCache.get('issues')
        ? Promise.resolve({data: issuesCache.get('issues')})
        : await request({url: `/repos/${owner}/${name}/issues`}, ctx.req, ctx.res),
    cache[full_name]
        ? Promise.resolve({data: cache[full_name]})
        : await request({url: `/repos/${owner}/${name}/labels`}, ctx.req, ctx.res),
  ]);

  return {
    owner,
    name,
    initialIssues: fetches[0].data,
    labels: fetches[1].data,
  }
};

export default withRepoBasic(Issues, 'issues')
