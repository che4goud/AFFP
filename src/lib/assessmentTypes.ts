export type Gender = "male" | "female" | "prefer_not_to_say";
export type YesNoAnswer = "yes" | "no" | "do_not_wish_to_answer";

export interface AssessmentAnswers {
  gender?: Gender;
  age?: number;
  housePurchase?: YesNoAnswer;
  marriage?: YesNoAnswer;
  hasLoan?: YesNoAnswer;
  yearsOfService?: number;
}

export type QuestionStep = 1 | 2 | 3 | 4 | 5 | 6;

export const TOTAL_QUESTIONS = 6;
