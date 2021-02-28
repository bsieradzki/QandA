/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { Page } from './Page'
import { useParams } from 'react-router-dom';
import { QuestionData, getQuestion } from './QuestionsData';
import { AnswerList } from './AnswerList';
import {
    gray3,
    gray6,
    Fieldset,
    FieldContainer,
    FieldLabel,
    FieldTextArea,
    FormButtonContainer,
    PrimaryButton
} from './Styles';
import { useForm } from 'react-hook-form';

type FormData = {
    content: string;
}
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

    const { register } = useForm<FormData>();
    
    return (
    <Page> Question Page {questionId}
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

            <form 
                css={css`
                    margin-top: 20px;
                `}
            >
                <Fieldset>
                    <FieldContainer>
                        <FieldLabel htmlFor="content">
                            Your Answer
                        </FieldLabel>
                        <FieldTextArea
                            id="content"
                            name="content"
                            ref={register}
                        />
                    </FieldContainer>
                    <FormButtonContainer>
                        <PrimaryButton type="submit">
                            Submit Your Answer
                        </PrimaryButton>
                    </FormButtonContainer>
                </Fieldset>
            </form>

        </React.Fragment>
    )}

    </Page>
    );
};


