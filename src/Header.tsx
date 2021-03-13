import React from "react";
import { UserIcon } from "./Icons";
import styles from "./Header.module.css";
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateSpreadAssignment } from "typescript";

type FormData = {
  search: string;  
}


export const Header = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const criteria = searchParams.get('criteria') || '';
  const {register, handleSubmit } = useForm<FormData>();
 

const submitForm = ({ search }: FormData) => {
  navigate(`search?criteria=${search}`);
};

  return (
    <form onSubmit={handleSubmit(submitForm)}>
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
    </form>
  );
};
