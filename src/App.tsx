import React from "react";
import styles from "./App.module.css";
import { Header } from "./Header";
import { HomePage } from "./HomePage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AskPage } from './AskPage';
import { SearchPage } from './SearchPage';
import { SignInPage } from './SignInPage';
import { NotFoundPage } from './NotFoundPage';
import { QuestionPage } from './QuestionPage';

function App() {
  return (
    <BrowserRouter>    
    <div className={styles.container}>
      <Header />
        <Routes>
          <Route path="" element={<HomePage/>}/>
          <Route path="search" element={<SearchPage/>}/>
          <Route path="ask" element={<AskPage/>}/>
          <Route path="signin" element={<SignInPage/>}/>
          <Route path="questions/:questionId" element={<QuestionPage/>}/>          
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
