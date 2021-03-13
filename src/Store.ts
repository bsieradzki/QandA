import { QuestionList } from './QuestionList';
import { QuestionData } from './QuestionsData';
import { Store, createStore, combineReducers } from 'redux';

interface QuestionsState {
    readonly loading: boolean;
    readonly unanswered: QuestionData[];
    readonly viewing: QuestionData | null;
    readonly searched: QuestionData[];
}

export interface AppState {
    readonly questions: QuestionsState;
}

const initialQuestionState: QuestionsState = {
    loading: false,
    unanswered: [],
    viewing: null,
    searched: []
};

export const GETTINGUNANSWEREDQUESTIOINS = "GettingUnansweredQuestions";
export const gettingUnansweredQuestionsAction = () =>
(
    {
        type: GETTINGUNANSWEREDQUESTIOINS,
    } as const
);

export const GOTUNANSWEREDQUESTIONS = "GotUnansweredQuestions";
export const gotUnansweredQuestionsAction = (questions: QuestionData[]) =>
(
    {
        type: GOTUNANSWEREDQUESTIONS,
        questions: questions,
    } as const
);

export const GETTINGQUESTION = "GettingQuestion";
export const gettingQuestionAction = () =>
(
    {
        type: GETTINGQUESTION 
    } as const
);

export const GOTQUESTION = "GotQuestion";
export const gotQuestionAction = (question: QuestionData | null) => 
(
    {
        type: GOTQUESTION,
        question: question,
    } as const
);

export const SEARCHINGQUESTIONS = "SearchingQuestions";
export const searchingQuestionsAction = () => 
(
    {
        type: SEARCHINGQUESTIONS
    } as const
);

export const SEARCHEDQUESTIONS = "SearchedQuestions";
export const searchedQuestionsAction = (questions: QuestionData[]) =>
(
    {
        type: SEARCHEDQUESTIONS,
        questions: questions
    } as const
);

type QuestionsActions = 
| ReturnType<typeof gettingUnansweredQuestionsAction>
| ReturnType<typeof gotUnansweredQuestionsAction>
| ReturnType<typeof gettingQuestionAction>
| ReturnType<typeof gotQuestionAction>
| ReturnType<typeof searchingQuestionsAction>
| ReturnType<typeof searchedQuestionsAction>;

const questionsReducer = (
    state = initialQuestionState,
    action: QuestionsActions
) => {
    //handle different actions here
    switch (action.type) {
        case GETTINGUNANSWEREDQUESTIOINS: {
            return {
                ...state,
                loading: true 
            };
        }
        case GOTUNANSWEREDQUESTIONS: {
            return {
                ...state,
                unanswered: action.questions,
                loading: false
            }
        }
        case GETTINGQUESTION:{
            return {
                ...state,
                viewing: null,
                loading: true
            }
        }
        case GOTQUESTION: {
            return {
                ...state,
                viewing: action.question,
                loading: false
            }
        }
        case SEARCHINGQUESTIONS: {
            return {
                ...state,
                searched: [],
                loading: true
            }
        }
        case SEARCHEDQUESTIONS: {
            return {
                ...state,
                searched: action.questions,
                loading: false
            }
        }
        
    }
    return state;
}

const rootReducer = combineReducers<AppState>
(
    {
        questions: questionsReducer
    }
);

export function configureStore(): Store<AppState> {
    const store = createStore(
        rootReducer,
        undefined
    );
    return store;
}