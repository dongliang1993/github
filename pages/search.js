import {withRouter} from 'next/router'
import {request} from '../lib/api'
import {Row, Col, List, Pagination} from 'antd'
import {useEffect, memo, isValidElement} from 'react'
import Link from 'next/link'
import {setArray} from '../lib/repo-basic-cache'
// import Router from 'next/router'
import Repo from '../components/repo'

/**
 * sort 排序方式
 * order 排序顺序
 * lang 开发主语言
 * page 分页
 * per_page 一页的数量
 */
const languages = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust'];
const sortTypes = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'forks',
    order: 'asc'
  },
];
const selectedStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 100,
};
const per_page = 20;
const isServer = typeof window === 'undefined';
const maxCount = 1000;
const FilterLink = memo(({name, query, lang, sort, order, page}) => {
  let queryString = `?query=${query}`;
  lang && (queryString += `&lang=${lang}`);
  sort && (queryString += `&sort=${sort}&order=${order || 'desc'}`);
  page && (queryString += `&page=${page}`);
  queryString += `&per_page=${per_page}`;
  return (
      <Link href={`/search${queryString}`}>
        {
          isValidElement(name) ? name : <a>{name}</a>
        }
      </Link>
  )
});

const noop = () => {
};
const Search = ({router, repos}) => {
  const {...querys} = router.query;
  const {sort, order, lang, page} = router.query;
  useEffect(() => {
    // 在非服务端时进行缓存，若在服务端进行缓存，会消耗服务端的内存。
    if (!isServer) {
      setArray(repos.items)
    }
  });
  return (
      <div className="root">
        <Row gutter={20}>
          <Col span={6}>
            <List
                bordered
                header={<span className={'list-header'}>语言</span>}
                style={{marginBottom: 20}}
                dataSource={languages}
                renderItem={item => {
                  // 判断当前language名字是否与query的language相等
                  const selected = lang === item;
                  return (
                      <List.Item style={selected ? selectedStyle : null}>
                        {
                          selected ? <span>{item}</span> : (
                              <FilterLink
                                  {...querys}
                                  name={item}
                                  lang={item}/>
                          )
                        }
                      </List.Item>
                  )
                }}
            />
            <List
                bordered
                header={<span className={'list-header'}>排序</span>}
                dataSource={sortTypes}
                renderItem={item => {
                  let selected = false;
                  // best match的情况
                  if (item.name === sortTypes[0].name && !sort) {
                    selected = true
                    // 其他情况
                  } else if (item.value === sort && item.order === order) {
                    selected = true;
                  }
                  return (
                      <List.Item style={selected ? selectedStyle : null}>
                        {
                          selected ? <span>{item.name}</span> : (
                              <FilterLink
                                  {...querys}
                                  order={item.order}
                                  name={item.name}
                                  sort={item.value}/>
                          )
                        }
                      </List.Item>
                  )
                }}
            />
          </Col>
          <Col span={18}>
            <h3 className="repos-title">{repos.total_count} 个仓库</h3>
            {
              repos.items.map((repo, index) => {
                return (
                    <Repo key={index} repo={repo}/>
                )
              })
            }
            <div className="pagination">
              <Pagination
                  pageSize={per_page}
                  current={+page || 1}
                  total={repos.total_count > maxCount ? 1000 : repos.total_count}
                  onChange={noop}
                  itemRender={(page, type, ol) => {
                    const p = type === 'page' ? page : type === 'prev' ? page - 1 : page + 1;
                    const name = type === 'page' ? page : ol;
                    return (
                        <FilterLink
                            {...querys}
                            name={name}
                            page={p}
                        />
                    )
                  }}
              />
            </div>
          </Col>
        </Row>
        <style jsx>
          {`
            .root {
              padding: 20px 0;
            }

            .list-header {
              font-weight: 800;
              font-size: 16px;
            }

            .repos-title {
              border-bottom： 1px solid #eee;
              font-size: 20px;
              line-height: 50px;
            }

            .pagination {
              padding: 20px;
              text-align: center;
            }
          `}
        </style>
      </div>
  )
};

Search.getInitialProps = async ({ctx}) => {
  const {query, sort, lang, order, page} = ctx.query;
  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    }
  }
  // ?q=react+language:javascript&sort=stars&order=desc&page=20
  // 拼接字符串形成一个完整的query
  let queryString = `?q=${query}`;
  lang && (queryString += `+language:${lang}`);
  sort && (queryString += `&sort=${sort}&order=${order || 'desc'}`);
  page && (queryString += `&page=${page}`);
  queryString += `&per_page=${per_page}`;
  let res = await request({
    url: `/search/repositories${queryString}`
  }, ctx.req, ctx.res);
  return {
    repos: res.data
  }
};

export default withRouter(Search)
