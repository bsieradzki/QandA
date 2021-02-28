import React from "react";
import { UserIcon } from "./Icons";
import styles from "./Header.module.css";
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

type FormData = {
  search: string;
}


export const Header = () => {
  const [searchParams] = useSearchParams();
  const criteria = searchParams.get('criteria') || '';
  const {register} = useForm<FormData>();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }
  return (
    <div className={styles.container}>
      <Link to="/">Q & A</Link>
      <input
        ref={register}
        name="search"
        type="text"
        placeholder="Search..."
        defaultValue={criteria}
      />
      <Link to="signin">
        <UserIcon />
        <span>Sign In</span>
      </Link>
    </div>
  );
};
