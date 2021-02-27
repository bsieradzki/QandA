import React from "react";
import { QuestionData } from "./QuestionsData";
import { Link } from 'react-router-dom';

interface Props {
  data: QuestionData;
  showContent?: boolean;
}

export const Question = ({ data, showContent = true }: Props) => (
  <div>
    <Link to={`/questions/${data.questionId}`}>
    <div>{`Your link will be /questions/${data.questionId}`}</div>
    <div>Title: {data.title}</div>
    </Link>
    <div>
      {data.content.length > 50
        ? `${data.content.substring(0, 50)}...`
        : data.content}
    </div>
    {showContent && <div>Content: {data.content}</div>}
    <div>
      {`Asked by ${
        data.userName
      } on ${data.created.toLocaleDateString()} ${data.created.toLocaleTimeString()}
        `}
    </div>
  </div>
);


