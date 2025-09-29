import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <img src={process.env.PUBLIC_URL + "/logo128.png"} className="app-logo" alt="logo" />
        <h1>Rosetta Fin</h1>
      </div>
      <div className="nav-bar">
        <a href="#" className="nav active">Home</a>
        <a href="#" className="nav">Search</a>
        <a href="#" className="nav">Following</a>
        <a href="#" className="nav">Settings</a>
      </div>
    </header>
  );
};

export default Header;
