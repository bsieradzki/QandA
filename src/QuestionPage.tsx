import React from 'react';
import { Page } from './Page'
import { useParams } from 'react-router-dom';
import { QuestionData, getQuestion } from './QuestionsData';
import { AnswerList } from './AnswerList';


export const QuestionPage = () => {

    //destructure the route parameter via the useParams() hook
    const { questionId } = useParams();

    const [question, setQuestion] = React.useState<QuestionData | null>(null);

    React.useEffect( () => {
        const doGetQuestion = async (
            questionId: number
        )  => {
            const foundQuestion = await getQuestion(questionId);
            setQuestion(foundQuestion);
        };    
        if (questionId)
        {
            doGetQuestion(Number(questionId));
        }
    }, [questionId]);

    return <Page> Question Page {questionId}
    <div>{question === null ? "null question returned?" : question.title}</div>

    {question !== null && (
        <React.Fragment>
            <p>
            {question.content}
            </p>
            <div>
                {`Asked by ${question.userName} on ${question.created.toLocaleDateString()} ${question.created.toLocaleTimeString()}`}
            </div>
            <AnswerList data={question.answers} />
        </React.Fragment>
    )}

    </Page>
};


