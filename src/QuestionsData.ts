import { title } from "node:process";
import { Answer } from "./Answer";

export interface QuestionData {
  questionId: number;
  title: string;
  content: string;
  userName: string;
  created: Date;
  answers: AnswerData[];
}

export interface AnswerData {
  answerId: number;
  content: string;
  userName: string;
  created: Date;
}

export const getUnansweredQuestions = async (): Promise<QuestionData[]> => {
  await wait(Math.random() * 1500);
  //fixing this to only return unanswered questions
  return questions.filter((q) => q.answers.length === 0);// || q.answers.length > 0);
};

export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const questions: QuestionData[] = [
  {
    questionId: 1,
    title: "Why should I learn TypeScript?",
    content:
      "TypeScript seems to be getting popular so I wondered whether it is worth my time learning it? What benefits does it give over JavaScript?",
    userName: "Bob",
    created: new Date(),
    answers: [
      {
        answerId: 1,
        content: "To catch problems earlier speeding up your developments",
        userName: "Jane",
        created: new Date(),
      },
      {
        answerId: 2,
        content:
          "So, that you can use the JavaScript features of tomorrow, today",
        userName: "Fred",
        created: new Date(),
      },
    ],
  },
  {
    questionId: 2,
    title: "Which state management tool should I use?",
    content:
      "There seem to be a fair few state management tools around for React - React, Unstated, ... Which one should I use?",
    userName: "Bob",
    created: new Date(),
    answers: [
      {
        answerId: 1,
        content: "The interstate",
        userName: "Jane",
        created: new Date(),
      },
      {
        answerId: 2,
        content:
          "You can manage all the states via Covid.",
        userName: "Fred",
        created: new Date(),
      },
    ],
  },
  {
    questionId: 3,
    title: "Why are you a pain?",
    content: "Why is javascript so loosy goosey weaked typed?",
    userName: "Cookie",
    created: new Date(),
    answers: [
      {
        answerId: 1,
        content: "Because you are a jackass!",
        userName: "Jane",
        created: new Date(),
      },
      {
        answerId: 2,
        content:
          "Maybe because you're a loser?",
        userName: "Fred",
        created: new Date(),
      },
    ],
  },
  {
    questionId: 4,
    title: "Is anyone going to answer my question?",
    content: "This is a stupid question with no real answer...you are a loser if you answer this question!",
    userName: "Twod",
    created: new Date(),
    answers: [],
  },
];

export const getQuestion = async (
  questionId: number
) : Promise<QuestionData | null> => {
  await wait(500);
  console.log("getQuestion for questionId == ", questionId);
  const results = questions.filter(q => q.questionId === questionId);
      return results.length === 0 ? null : results[0];
};

export const searchQuestions = async ( criteria: string): Promise<QuestionData[]> =>
{
  console.log("searchQuestions()", criteria);
  await wait(500);
  
  // const regExp = new RegExp(criteria, 'i');
  // const result = questions.reduce((acc, {questionId, answers = []}) => {
  //   const next = answers.filter(child => child.content.match(regExp));

  //   if (title.match(regExp) || next.length > 0) {
  //     acc.({title, children: next});
  //   }
  //   return acc;
  // })

  //so this filters on the question title or question content or any child answer's content but is case sensitive as-is
  const res = questions.reduce((acc: QuestionData[], qd) => {
    const matchedAnswers = qd.answers && qd.answers.filter(b => b.content.includes(criteria));
    if(matchedAnswers && matchedAnswers.length) acc.push({...qd});
    else if(qd.title.includes(criteria) || qd.content.includes(criteria)) acc.push({ ...qd });

    return acc;
  }, []);

  //this filter uses match function and regular expression and is case insensitive
  const regExp = new RegExp(criteria, "i");  
  const reReult = questions.reduce((acc: QuestionData[], qd) => {
    const matchedAnswers = qd.answers && qd.answers.filter(b => b.content.match(regExp));
    if(matchedAnswers && matchedAnswers.length) acc.push({...qd});
    else if(qd.title.match(regExp) || qd.content.match(regExp)) acc.push({ ...qd });

    return acc;
  }, []);

  return reReult;
  console.log("test res=", res);
  return questions.filter(
    q =>
      //q.title.toLowerCase().indexOf(criteria.toLowerCase()) >= 0
      //||
      //q.content.toLowerCase().indexOf(criteria.toLowerCase()) >= 0
      //||
      q.answers.filter(q => q.content.toLowerCase().indexOf(criteria.toLowerCase()) >= 0)
  );
}

export interface PostQuestionData {
  title: string;
  content: string;
  userName: string;
  created: Date;
}

export const postQuestion = async (
  question: PostQuestionData,
): Promise<QuestionData | undefined> => {
  await wait(500);
  const questionId = Math.max(...questions.map(q=>q.questionId)) + 1;
  const newQuestion: QuestionData = {
    ...question,
    questionId,
    answers: [],
  };
  questions.push(newQuestion);
  return newQuestion;
};

export interface PostAnswerData {
  questionId: number;
  content: string;
  userName: string;
  created: Date;
}

export const doPostAnswer = async (answer: PostAnswerData) : Promise<AnswerData | undefined> => {
  await wait (500);
  const question = questions.filter(q => q.questionId === answer.questionId)[0];
  const newAnswerId = Math.max(...question.answers.map(a => a.answerId)) + 1;
  const answerInQuestion: AnswerData = {
    answerId: newAnswerId,
    ...answer
  };
  console.log("in doPostAnswer()...", answerInQuestion);
  question.answers.push(answerInQuestion);
  return answerInQuestion;
};