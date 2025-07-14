import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, Button } from "antd";
import { useCookies } from "react-cookie";
import {
  MenuFoldOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";

import logo from "/assets/logo.png"; // ✅ Correct usage with Vite
import "../styles/navbar.css";

import { useSelector } from "react-redux";

const Navbar = () => {
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const userName = currentUser.data.data.user.username;
  const userEmail = currentUser.data.data.user.email;

  const logout = () => {
    setCookies("access_token", "");
    localStorage.clear();
    navigate("/auth/login");
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      <Button type="primary" onClick={() => navigate("/user-profile")} block>
        See Profile
      </Button>

      <Button danger onClick={logout} block>
        Logout
      </Button>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbarContainer">
        <div className="navbarLeft">
          <img src={logo} alt="logo" className="navbarLogo" />
          <span className="appTitle">Recipe Book</span>
        </div>

        <div className={`navLinks ${showMenu ? "show" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/create-recipe">Create</Link>
          <Link to="/saved-recipes">Saved</Link>
          <Link to="/my-recipes">My Recipes</Link>
        </div>

        <div className="navbarRight">
          <Popover content={content} title={userName} trigger="click">
            <Button type="text" icon={<UserOutlined />} className="userBtn">
              {userName}
            </Button>
          </Popover>

          <div className="hamburgerIcon" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <CloseOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
