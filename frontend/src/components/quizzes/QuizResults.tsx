'use client';

import { QuizAttempt, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '@/types/quiz';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface QuizResultsProps {
  attempt: QuizAttempt;
  showAnswers?: boolean;
}

export function QuizResults({ attempt, showAnswers = true }: QuizResultsProps) {
  const questions = attempt.quiz?.questions || [];
  const answers = attempt.answers || [];

  const getAnswerForQuestion = (questionId: number) => {
    return answers.find((a) => a.question_id === questionId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-neutral-900">نتيجة الاختبار</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${ATTEMPT_STATUS_COLORS[attempt.status]}`}>
            {ATTEMPT_STATUS_LABELS[attempt.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Score */}
          <div className="text-center p-4 bg-neutral-50 rounded-xl">
            <div className={`text-3xl font-bold ${attempt.is_passed ? 'text-success-600' : 'text-error-600'}`}>
              {attempt.percentage?.toFixed(1)}%
            </div>
            <div className="text-sm text-neutral-500 mt-1">النسبة المئوية</div>
          </div>

          {/* Points */}
          <div className="text-center p-4 bg-neutral-50 rounded-xl">
            <div className="text-3xl font-bold text-neutral-700">
              {attempt.score?.toFixed(1)} / {attempt.quiz?.total_marks}
            </div>
            <div className="text-sm text-neutral-500 mt-1">الدرجة</div>
          </div>

          {/* Correct Answers */}
          <div className="text-center p-4 bg-neutral-50 rounded-xl">
            <div className="text-3xl font-bold text-success-600">
              {attempt.correct_answers_count} / {attempt.total_questions}
            </div>
            <div className="text-sm text-neutral-500 mt-1">إجابات صحيحة</div>
          </div>

          {/* Time */}
          <div className="text-center p-4 bg-neutral-50 rounded-xl">
            <div className="text-3xl font-bold text-neutral-700">
              {Math.floor((attempt.time_taken_seconds || 0) / 60)}:{((attempt.time_taken_seconds || 0) % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-neutral-500 mt-1">الوقت المستغرق</div>
          </div>
        </div>

        {/* Pass/Fail Status */}
        <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 transition-all duration-200 ${
          attempt.is_passed ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'
        }`}>
          {attempt.is_passed ? (
            <>
              <CheckCircleIcon className="w-8 h-8 text-success-600" />
              <div>
                <div className="font-semibold text-success-800">ناجح</div>
                <div className="text-sm text-success-600">
                  لقد اجتزت الاختبار بنجاح. أحسنت!
                </div>
              </div>
            </>
          ) : (
            <>
              <XCircleIcon className="w-8 h-8 text-error-600" />
              <div>
                <div className="font-semibold text-error-800">لم تجتز</div>
                <div className="text-sm text-error-600">
                  نسبة النجاح المطلوبة: {attempt.quiz?.pass_percentage}%
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Answers Review */}
      {showAnswers && questions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-extrabold text-neutral-900">مراجعة الإجابات</h3>
          </div>

          <div className="divide-y divide-neutral-200">
            {questions.map((question, index) => {
              const answer = getAnswerForQuestion(question.id);
              const isCorrect = answer?.is_correct;
              const selectedOption = answer?.selected_option;
              const correctOption = question.options?.find((o) => o.is_correct);

              return (
                <div key={question.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCorrect === true
                        ? 'bg-success-100 text-success-600'
                        : isCorrect === false
                        ? 'bg-error-100 text-error-600'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {isCorrect === true ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : isCorrect === false ? (
                        <XCircleIcon className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-xl">
                          {question.question_type_label}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {answer?.marks_obtained || 0} / {question.marks} درجة
                        </span>
                      </div>

                      <h4 className="text-neutral-900 font-medium mb-3">{question.question_text}</h4>

                      {/* Show options for MCQ and true/false */}
                      {['multiple_choice', 'true_false'].includes(question.question_type) && (
                        <div className="space-y-2">
                          {question.options?.map((option) => {
                            const isSelected = selectedOption?.id === option.id;
                            const isCorrectOption = option.is_correct;

                            let optionClass = 'bg-neutral-50 border-neutral-200';
                            if (isSelected && isCorrectOption) {
                              optionClass = 'bg-success-50 border-success-300';
                            } else if (isSelected && !isCorrectOption) {
                              optionClass = 'bg-error-50 border-error-300';
                            } else if (isCorrectOption) {
                              optionClass = 'bg-success-50 border-success-300';
                            }

                            return (
                              <div
                                key={option.id}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${optionClass}`}
                              >
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  isSelected
                                    ? isCorrectOption
                                      ? 'border-success-500 bg-success-500'
                                      : 'border-error-500 bg-error-500'
                                    : isCorrectOption
                                    ? 'border-success-500'
                                    : 'border-neutral-300'
                                }`} />
                                <span className={isCorrectOption ? 'text-success-700' : 'text-neutral-700'}>
                                  {option.option_text}
                                </span>
                                {isCorrectOption && (
                                  <span className="text-xs text-success-600 mr-auto">(الإجابة الصحيحة)</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Show text answer for short answer and essay */}
                      {['short_answer', 'essay'].includes(question.question_type) && (
                        <div className="space-y-2">
                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                            <div className="text-xs text-neutral-500 mb-1">إجابتك:</div>
                            <div className="text-neutral-700">{answer?.answer_text || 'لم تقدم إجابة'}</div>
                          </div>
                          {question.question_type === 'short_answer' && correctOption && (
                            <div className="p-3 bg-success-50 rounded-xl border border-success-200">
                              <div className="text-xs text-success-600 mb-1">الإجابة الصحيحة:</div>
                              <div className="text-success-700">{correctOption.option_text}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-primary-50 rounded-xl border border-primary-200">
                          <div className="text-xs text-primary-600 mb-1">الشرح:</div>
                          <div className="text-primary-700 text-sm">{question.explanation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
