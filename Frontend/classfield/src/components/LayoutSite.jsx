import { Breadcrumb, Layout, Menu, theme, ConfigProvider } from "antd";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  HomeFilled,
  UserAddOutlined,
  UserOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useContext } from "react";
import { UserContext } from "../contexts/user.context";

const { Header, Content, Footer } = Layout;

const itemsLR = [
  {
    key: "register",
    label: <Link to="register">Register</Link>,
    icon: <UserAddOutlined />,
  },
  {
    key: "login",
    label: <Link to="login">Login</Link>,
    icon: <UserOutlined />,
  },
];

const itemsL = [
  {
    key: "logout",
    label: <Link to="logout">Logout</Link>,
    icon: <UserAddOutlined />,
  },
];

const LayoutSite = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { username } = useContext(UserContext);
  const navigate = useNavigate();

  const items = [
    {
      key: "/",
      label: (
        <span onClick={() => navigate("/", { replace: true })}>Home</span>
      ),
      icon: <HomeFilled />,
    },
    {
      key: "/favorites",
      label: <Link to="/favorites">Favorites</Link>,
      icon: <HeartFilled style={{ color: "#ff4d4f" }} />,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              horizontalItemSelectedColor: "rgba(255, 255, 255, 0.85)",
              horizontalItemHoverColor: "#fff",
              horizontalItemSelectedBg: "transparent",
              itemSelectedColor: "rgba(255, 255, 255, 0.85)",
              itemHoverColor: "#fff",
              horizontalItemIndicatorHeight: 0,
              horizontalItemIndicatorColor: "transparent",
            },
          },
        }}
      >
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            background: "#0f3364",
            justifyContent: "space-between",
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            items={items}
            style={{ flex: 1, background: "none", border: "none" }}
            selectedKeys={[]}
          />

          <Menu
            theme="dark"
            mode="horizontal"
            items={username != null ? itemsL : itemsLR}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              minWidth: "200px",
              display: "flex",
              justifyContent: "flex-end",
            }}
            selectedKeys={[]}
          />
        </Header>
      </ConfigProvider>

      <Content style={{ padding: "0 24px", minHeight: "100%" }}>
        <Breadcrumb style={{ margin: "12px 0" }} />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Team №4 Classfield
        Project
      </Footer>
    </Layout>
  );
};

export default LayoutSite;