/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';
import { QuestionList } from './QuestionList';
import { searchQuestions, QuestionData } from './QuestionsData';

import React from 'react';
import { Page } from './Page';


export const SearchPage = () => {
    //destructure the query parameter(s) via the useSearchParams() react hook
    //this hook returns two elements, the first contains the search params
    //the second (not using here) is a function to update the query params
    const [searchParams] = useSearchParams();
    const [questions, setQuestions] = React.useState<QuestionData[]>([]);
    const search = searchParams.get("criteria") || "";

    React.useEffect(
        () => {
            const doSearch = async (criteria: string ) => {
                const foundResults = await searchQuestions(criteria);
                setQuestions(foundResults);
            };
            doSearch(search);            
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