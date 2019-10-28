import React, {useState, useCallback} from "react";
import {Layout as AntLayout, Icon, Input, Avatar, Tooltip, Dropdown, Menu} from 'antd'
import getConfig from 'next/config'
import {withRouter} from 'next/router'
import {connect} from 'react-redux'
// import axios from 'axios'
import Container from "./container";
import {logout} from '../store/action'
import Router from 'next/router'


const {Header, Content, Footer} = AntLayout;
const {Search} = Input;
const iconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20
};
const footerStyle = {
  textAlign: 'center'
};
const ToggleStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center'
};
const infoStyle = {
  marginLeft: 10
};
const {publicRuntimeConfig} = getConfig();

const Layout = ({children, user, logout, router}) => {
  const urlQuery = router.query && router.query.query&& router.query.query.split(' ')[0];
  console.log(urlQuery)
  const [searchValue, setSearchValue] = useState(urlQuery || '');
  const handleSearchChange = useCallback((event) => {
    setSearchValue(event.target.value)
  }, [setSearchValue]);
  const handleOnSearch = useCallback(() => {
    Router.push({
      pathname: '/search',
      query: {
        query: searchValue
      }
    })
  }, [searchValue]);
  const handleLogOut = useCallback(() => {
    logout();
    // Router.push('/')
  }, [logout]);
  const userDropDown = (
      <Menu>
        <Menu.Item>
          <Container renderer={<span style={ToggleStyle}/>}>
            <Icon type="poweroff"/><a onClick={handleLogOut} style={infoStyle}>注销</a>
          </Container>
        </Menu.Item>
      </Menu>
  );
  return (
      <AntLayout>
        <Header>
          <Container renderer={<div className="header-inner"/>}>
            <section className="header-left">
              <div className="logo">
                <a href="/">
                  <Icon type={'github'} style={iconStyle}/>
                </a>
              </div>
              <div className="search">
                <Search
                    placeholder={'搜索仓库'}
                    value={searchValue}
                    onChange={handleSearchChange}
                    onSearch={handleOnSearch}
                />
              </div>
            </section>
            <section className="header-right">
              <div className="user">
                {
                  user && user.id ? (
                      <Dropdown overlay={userDropDown} placement={"bottomRight"}>
                        <Avatar size={40} src={user.avatar_url}/>
                      </Dropdown>
                  ) : (
                      <Tooltip title={'点击进行登录'}>
                        <a href={`/prepare-auth?url=${router.asPath}`}>
                          <Avatar size={40} icon={'user'}/>
                        </a>
                      </Tooltip>
                  )
                }
              </div>
            </section>
          </Container>
        </Header>
        <Content>
          <Container>
            {children}
          </Container>
        </Content>
        <Footer style={footerStyle}>
          Develop by ainuo5213 @<a href='mailto:1660998482@qq.com'>1660998482@qq.com</a>
        </Footer>
        <style jsx>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          justify-content: flex-start;
        }
        `}</style>
        <style jsx global>
          {`
           #__next {
             height: 100%;
           }

           .ant-layout {
            min-height: 100%;
           }

           .ant-layout-header {
             padding-left: 0;
             padding-right: 0
           }

           .ant-layout-content {
             background-color: #fff;
           }
        `}
        </style>
      </AntLayout>
  )
};
const mapStateToProps = state => ({
  user: state.user
});
const mapDispatchToProps = disptach => ({
  logout() {
    disptach(logout())
  }
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))
