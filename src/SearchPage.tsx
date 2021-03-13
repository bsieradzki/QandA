/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';
import { QuestionList } from './QuestionList';
import { searchQuestions } from './QuestionsData';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, searchingQuestionsAction, searchedQuestionsAction } from './Store';

import React from 'react';
import { Page } from './Page';


export const SearchPage = () => {

    const dispatch = useDispatch();

    //destructure the query parameter(s) via the useSearchParams() react hook
    //this hook returns two elements, the first contains the search params
    //the second (not using here) is a function to update the query params
    
    
    const [searchParams] = useSearchParams();
    //no more local state, using redux;
    // const [questions, setQuestions] = React.useState<QuestionData[]>([]);
    const questions = useSelector((state: AppState) => state.questions.searched);
    const search = searchParams.get("criteria") || "";

    React.useEffect(
        () => {
            const doSearch = async (criteria: string ) => {
                console.log("SearchPage.tsx calling doSearch()", search);
                dispatch(searchingQuestionsAction());            
                const foundResults = await searchQuestions(criteria);
                dispatch(searchedQuestionsAction(foundResults));
                //setQuestions(foundResults);
            };
            console.log("SearchPage.tsx calling doSearch()", search);
            doSearch(search);            
            ////// eslint-disable-next-line react hooks/exhaustive-deps
        },
        [search]   
    )

    return <Page title="Search Results">
        {search && (
            <p 
                css={css`
                    font-size: 16px;
                    font-style: italic;
                    margin-top: 0px;
            `}
            >
                for "{search}"
            </p>
        )}
        <QuestionList data={questions} />
        </Page>
};