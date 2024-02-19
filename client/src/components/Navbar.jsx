import React from "react";
import { Layout, Menu } from "antd";
const { Header } = Layout;

const Navbar = () => {
  const handleHomeClick = () => {
    window.location.href = "http://localhost:3000/";
  };
  const handleCancelClick = () => {
    window.location.href = "http://localhost:3000/cancel";
  };
  return (
    <Header>
      <div className="navbar-container">
        <div className="menu-container">
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1" onClick={handleHomeClick}>
              Home
            </Menu.Item>
          </Menu>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="2" onClick={handleCancelClick}>
              Cancel
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
