/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from "react";
import styles from "./App.module.css";
import { Header } from "./Header";
import { HomePage } from "./HomePage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchPage } from './SearchPage';
import { SignInPage } from './SignInPage';
import { NotFoundPage } from './NotFoundPage';
import { QuestionPage } from './QuestionPage';
import { wait } from './QuestionsData';

const AskPage = React.lazy( () => import("./AskPage"));


function App() {
  return (
    <BrowserRouter>    
    <div className={styles.container}>
      <Header />
        <Routes>
          <Route path="" element={<HomePage/>}/>
          <Route path="ask" element=
          {<React.Suspense fallback={
            <div
              css={css`
                margin-top: 100px;
                text-align: center;
            `}
            >
              Loading...
              {/* {wait(500)} */}
            </div>
          }
          >
            <AskPage />
          </React.Suspense>
          }/>
          <Route path="search" element={<SearchPage/>}/>
          <Route path="signin" element={<SignInPage/>}/>
          <Route path="questions/:questionId" element={<QuestionPage/>}/>          
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;