import React from "react";
import { UserIcon } from "./Icons";
import styles from "./Header.module.css";
import { Link } from 'react-router-dom';

export const Header = () => {
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("You typed: " + e.currentTarget.value);
  };

  return (
    <div className={styles.container}>
      <Link to="/">Q & A</Link>
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearchInputChange}
      />
      <Link to="signin">
        <UserIcon />
        <span>Sign In</span>
      </Link>
    </div>
  );
};
