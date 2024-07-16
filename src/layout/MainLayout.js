import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, QuestionCircleOutlined, ContactsOutlined } from '@ant-design/icons';
import './MainLayout.less';

const rootRoutes = ['/', '/about', '/contact'];
const aboutSubRoutes = ['/about/me', '/about/company'];

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout>
      <Layout.Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[
            aboutSubRoutes.includes(window.location.pathname)
              ? '1'
              : rootRoutes.indexOf(window.location.pathname).toString(),
          ]}
        >
          <Menu.Item key="0">
            <Link to="/">
              <HomeOutlined />
              <span className="menu-item-link">Home</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/about">
              <QuestionCircleOutlined />
              <span className="menu-item-link">About</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/contact">
              <ContactsOutlined />
              <span className="menu-item-link">Contact</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        {children}
      </Layout>
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;