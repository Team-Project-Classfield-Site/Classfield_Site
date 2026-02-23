import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';

import {
    HomeFilled,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const items = [
    {
        key: '/',
        label: <Link to="/">Home</Link>,
        icon: <HomeFilled />
    },
]

const LayoutSite = () => {
    const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: "rgba(0, 0, 0, 0.85)" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0, background: "none" }}
        />
      </Header>

      <Content style={{ padding: '0 24px', minHeight: '100vh' }}>
        <Breadcrumb style={{ margin: '12px 0' }} />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Team №4 Classfield Project
      </Footer>
    </Layout>
  );
};

export default LayoutSite;