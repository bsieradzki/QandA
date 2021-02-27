import React from "react";
import { UserIcon } from "./Icons";
import styles from "./Header.module.css";
import { Link, useSearchParams } from 'react-router-dom';

export const Header = () => {
  const [searchParams] = useSearchParams();
  const criteria = searchParams.get('criteria') || '';
  const [search, setSearch] = React.useState(criteria);
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("You typed: " + e.currentTarget.value);
    setSearch(e.currentTarget.value);
  };

  return (
    <div className={styles.container}>
      <Link to="/">Q & A</Link>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearchInputChange}
      />
      <Link to="signin">
        <UserIcon />
        <span>Sign In</span>
      </Link>
    </div>
  );
};
