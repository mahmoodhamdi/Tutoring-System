export interface QuizOption {
  id: number;
  question_id: number;
  option_text: string;
  is_correct?: boolean;
  order_index: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question_type_label: string;
  marks: number;
  order_index: number;
  explanation?: string;
  options: QuizOption[];
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: number;
  group_id: number | null;
  title: string;
  description?: string;
  instructions?: string;
  duration_minutes: number;
  total_marks: number;
  pass_percentage: number;
  max_attempts: number;
  shuffle_questions: boolean;
  shuffle_answers: boolean;
  show_correct_answers: boolean;
  show_score_immediately: boolean;
  available_from?: string;
  available_until?: string;
  is_published: boolean;
  is_available: boolean;
  questions_count: number;
  attempts_count: number;
  completed_attempts_count: number;
  average_score?: number;
  average_percentage?: number;
  group?: {
    id: number;
    name: string;
  };
  questions?: QuizQuestion[];
  created_at: string;
  updated_at: string;
}

export interface QuizAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  selected_option_id?: number;
  answer_text?: string;
  is_correct?: boolean;
  marks_obtained?: number;
  question?: QuizQuestion;
  selected_option?: QuizOption;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  student_id: number;
  started_at: string;
  completed_at?: string;
  score?: number;
  percentage?: number;
  is_passed?: boolean;
  time_taken_seconds?: number;
  time_remaining_seconds?: number;
  status: 'in_progress' | 'completed' | 'timed_out' | 'abandoned';
  status_label: string;
  is_timed_out: boolean;
  correct_answers_count: number;
  total_questions: number;
  quiz?: Quiz;
  student?: {
    id: number;
    name: string;
    email: string;
  };
  answers?: QuizAnswer[];
  created_at: string;
  updated_at: string;
}

export interface CreateQuizData {
  group_id?: number;
  title: string;
  description?: string;
  instructions?: string;
  duration_minutes: number;
  pass_percentage: number;
  max_attempts: number;
  shuffle_questions?: boolean;
  shuffle_answers?: boolean;
  show_correct_answers?: boolean;
  show_score_immediately?: boolean;
  available_from?: string;
  available_until?: string;
}

export interface UpdateQuizData extends Partial<CreateQuizData> {}

export interface CreateQuestionData {
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  marks: number;
  explanation?: string;
  options?: {
    option_text: string;
    is_correct: boolean;
  }[];
}

export interface UpdateQuestionData extends Partial<CreateQuestionData> {}

export interface SubmitQuizData {
  answers: {
    question_id: number;
    selected_option_id?: number;
    answer_text?: string;
  }[];
}

export interface GradeAnswerData {
  marks_obtained: number;
  is_correct: boolean;
}

export interface QuizzesFilters {
  group_id?: number;
  is_published?: boolean;
  available_only?: boolean;
  search?: string;
  per_page?: number;
  page?: number;
}

export const QUESTION_TYPE_LABELS: Record<QuizQuestion['question_type'], string> = {
  multiple_choice: 'اختيار من متعدد',
  true_false: 'صح أو خطأ',
  short_answer: 'إجابة قصيرة',
  essay: 'مقالي',
};

export const ATTEMPT_STATUS_LABELS: Record<QuizAttempt['status'], string> = {
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل',
  timed_out: 'انتهى الوقت',
  abandoned: 'متروك',
};

export const ATTEMPT_STATUS_COLORS: Record<QuizAttempt['status'], string> = {
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  timed_out: 'bg-orange-100 text-orange-800',
  abandoned: 'bg-gray-100 text-gray-800',
};
