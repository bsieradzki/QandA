import React from "react";
import { QuestionList } from "./QuestionList";
import { getUnansweredQuestions, QuestionData } from "./QuestionsData";
import { Page } from "./Page";
import { PageTitle } from "./PageTitle";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [questions, setQuestions] = React.useState<QuestionData[]>([]);
  const [questionsLoading, setQuestionsLoading] = React.useState(true);

  React.useEffect(() => {
    console.log("first rendered");
    const doGetUnansweredQuestions = async () => {
      const unansweredQuestions = await getUnansweredQuestions();
      setQuestions(unansweredQuestions);
      setQuestionsLoading(false);
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
