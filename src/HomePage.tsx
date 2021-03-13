import React from "react";
import { QuestionList } from "./QuestionList";
import { getUnansweredQuestions } from "./QuestionsData";
import { Page } from "./Page";
import { PageTitle } from "./PageTitle";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { gettingUnansweredQuestionsAction, gotUnansweredQuestionsAction, AppState } from './Store';

export const HomePage = () => {
  const dispatch = useDispatch();
  const questions = useSelector((state: AppState) => state.questions.unanswered);
  const questionsLoading = useSelector((state: AppState) => state.questions.loading);

  //we now maintain state via redux
  // const [questions, setQuestions] = React.useState<QuestionData[]>([]);
  // const [questionsLoading, setQuestionsLoading] = React.useState(true);

  React.useEffect(() => {
    dispatch(gettingUnansweredQuestionsAction());
    const doGetUnansweredQuestions = async () => {
      const unansweredQuestions = await getUnansweredQuestions();
    dispatch(gotUnansweredQuestionsAction(unansweredQuestions));
    
    //we don't have local state it's in redux now...
    // setQuestions(unansweredQuestions);
    // setQuestionsLoading(false);
    };
    doGetUnansweredQuestions();
  }, []);

  const navigate = useNavigate();
  
  const handleAskQuestionClick = () => {
    navigate('ask');
  };

  return (
    <Page>
      <div>
        <PageTitle>Unanswered Questions</PageTitle>
        <button onClick={handleAskQuestionClick}>Ask a question</button>
      </div>
      {questionsLoading ? (
        <div>Loading...</div>
      ) : (
        <QuestionList data={questions} />
      )}
    </Page>
  );
};
