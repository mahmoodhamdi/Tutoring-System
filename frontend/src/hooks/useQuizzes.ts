import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizzesApi } from '@/lib/api/quizzes';
import type {
  Quiz,
  QuizAttempt,
  CreateQuizData,
  UpdateQuizData,
  CreateQuestionData,
  UpdateQuestionData,
  SubmitQuizData,
  GradeAnswerData,
  QuizzesFilters,
} from '@/types/quiz';

export const quizKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizKeys.all, 'list'] as const,
  list: (filters?: QuizzesFilters) => [...quizKeys.lists(), filters] as const,
  details: () => [...quizKeys.all, 'detail'] as const,
  detail: (id: number) => [...quizKeys.details(), id] as const,
  attempts: (quizId: number) => [...quizKeys.all, 'attempts', quizId] as const,
  myAttempts: (quizId: number) => [...quizKeys.all, 'my-attempts', quizId] as const,
  attempt: (quizId: number, attemptId: number) => [...quizKeys.attempts(quizId), attemptId] as const,
};

// Quizzes list
export function useQuizzes(filters?: QuizzesFilters) {
  return useQuery({
    queryKey: quizKeys.list(filters),
    queryFn: () => quizzesApi.getAll(filters),
  });
}

// Single quiz
export function useQuiz(id: number) {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => quizzesApi.getById(id),
    enabled: !!id,
  });
}

// Create quiz
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizData) => quizzesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

// Update quiz
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQuizData }) =>
      quizzesApi.update(id, data),
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.setQueryData(quizKeys.detail(quiz.id), quiz);
    },
  });
}

// Delete quiz
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => quizzesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

// Publish quiz
export function usePublishQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => quizzesApi.publish(id),
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.setQueryData(quizKeys.detail(quiz.id), quiz);
    },
  });
}

// Unpublish quiz
export function useUnpublishQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => quizzesApi.unpublish(id),
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.setQueryData(quizKeys.detail(quiz.id), quiz);
    },
  });
}

// Duplicate quiz
export function useDuplicateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => quizzesApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

// Add question
export function useAddQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: number; data: CreateQuestionData }) =>
      quizzesApi.addQuestion(quizId, data),
    onSuccess: (quiz) => {
      queryClient.setQueryData(quizKeys.detail(quiz.id), quiz);
    },
  });
}

// Update question
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, questionId, data }: { quizId: number; questionId: number; data: UpdateQuestionData }) =>
      quizzesApi.updateQuestion(quizId, questionId, data),
    onSuccess: (quiz) => {
      queryClient.setQueryData(quizKeys.detail(quiz.id), quiz);
    },
  });
}

// Delete question
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, questionId }: { quizId: number; questionId: number }) =>
      quizzesApi.deleteQuestion(quizId, questionId),
    onSuccess: (quiz) => {
      queryClient.setQueryData(quizKeys.detail(quiz.id), quiz);
    },
  });
}

// Reorder questions
export function useReorderQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, questionIds }: { quizId: number; questionIds: number[] }) =>
      quizzesApi.reorderQuestions(quizId, questionIds),
    onSuccess: (quiz) => {
      queryClient.setQueryData(quizKeys.detail(quiz.id), quiz);
    },
  });
}

// Start quiz attempt
export function useStartQuizAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => quizzesApi.startAttempt(quizId),
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.myAttempts(attempt.quiz_id) });
    },
  });
}

// Submit quiz attempt
export function useSubmitQuizAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, attemptId, data }: { quizId: number; attemptId: number; data: SubmitQuizData }) =>
      quizzesApi.submitAttempt(quizId, attemptId, data),
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.myAttempts(attempt.quiz_id) });
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts(attempt.quiz_id) });
    },
  });
}

// Get my attempts
export function useMyQuizAttempts(quizId: number) {
  return useQuery({
    queryKey: quizKeys.myAttempts(quizId),
    queryFn: () => quizzesApi.getMyAttempts(quizId),
    enabled: !!quizId,
  });
}

// Get all attempts (teacher)
export function useQuizAttempts(quizId: number) {
  return useQuery({
    queryKey: quizKeys.attempts(quizId),
    queryFn: () => quizzesApi.getAllAttempts(quizId),
    enabled: !!quizId,
  });
}

// Get single attempt
export function useQuizAttempt(quizId: number, attemptId: number) {
  return useQuery({
    queryKey: quizKeys.attempt(quizId, attemptId),
    queryFn: () => quizzesApi.getAttempt(quizId, attemptId),
    enabled: !!quizId && !!attemptId,
  });
}

// Grade essay answer
export function useGradeAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      attemptId,
      answerId,
      data,
    }: {
      quizId: number;
      attemptId: number;
      answerId: number;
      data: GradeAnswerData;
    }) => quizzesApi.gradeAnswer(quizId, attemptId, answerId, data),
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts(attempt.quiz_id) });
      queryClient.setQueryData(quizKeys.attempt(attempt.quiz_id, attempt.id), attempt);
    },
  });
}
