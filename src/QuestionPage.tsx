/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { Page } from './Page'
import { useParams } from 'react-router-dom';
import { QuestionData, getQuestion, doPostAnswer } from './QuestionsData';
import { AnswerList } from './AnswerList';
import {
    gray3,
    gray6,
    Fieldset,
    FieldContainer,
    FieldLabel,
    FieldTextArea,
    FormButtonContainer,
    PrimaryButton,
    FieldError,
    SubmissionSuccess
} from './Styles';
import { useForm } from 'react-hook-form';

type FormData = {
    content: string;
}
export const QuestionPage = () => {

    const [
        successfullySubmitted,
        setSuccessfullySubmitted
    ] = React.useState(false);

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
            console.log("QuestionPage.tsx calling doGetQuestion for questonId:", questionId);
            doGetQuestion(Number(questionId));
        }
    }, [questionId]);

    const { register, errors, handleSubmit, formState } = useForm<FormData>({
        mode: "onBlur"
    });
    
    const submitForm = async (data: FormData) => {
        console.log("QuestonPage.tsx in submitForm() about to call doPostAnswer:", question!.questionId, data.content);
        const result = await doPostAnswer({
            questionId: question!.questionId,
            content: data.content,
            userName: "Fred",
            created: new Date(),
        });
        setSuccessfullySubmitted(result ? true : false);
    };

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

            <form onSubmit={handleSubmit(submitForm)}
                css={css`
                    margin-top: 20px;
                `}
            >
                <Fieldset
                    disabled={
                        formState.isSubmitting || successfullySubmitted
                    }
                >
                    <FieldContainer>
                        <FieldLabel htmlFor="content">
                            Your Answer
                        </FieldLabel>
                        <FieldTextArea
                            id="content"
                            name="content"
                            ref={register({
                                required: true,
                                minLength: 50
                            })}
                        />
                        {errors.content &&
                            errors.content.type === "required" &&
                            (
                                <FieldError>
                                    You must enter the answer.
                                </FieldError>
                            )
                        }
                        {errors.content &&
                            errors.content.type == "minLength" &&
                            (
                                <FieldError>
                                    The answer must be at least 50 characters :-)
                                </FieldError>
                            )
                            }
                    </FieldContainer>
                    <FormButtonContainer>
                        <PrimaryButton type="submit">
                            Submit Your Answer
                        </PrimaryButton>
                    </FormButtonContainer>
                    {successfullySubmitted && (
                        
                        <SubmissionSuccess>
                            Your answer was successfully submitted!
                        </SubmissionSuccess>
                    )}
                </Fieldset>
            </form>

        </React.Fragment>
    )}

    </Page>
    );
};


