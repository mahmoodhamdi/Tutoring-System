'use client';

import { QuizAttempt, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '@/types/quiz';
import { CheckCircleIcon, XCircleIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">نتيجة الاختبار</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${ATTEMPT_STATUS_COLORS[attempt.status]}`}>
            {ATTEMPT_STATUS_LABELS[attempt.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Score */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-3xl font-bold ${attempt.is_passed ? 'text-green-600' : 'text-red-600'}`}>
              {attempt.percentage?.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 mt-1">النسبة المئوية</div>
          </div>

          {/* Points */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-700">
              {attempt.score?.toFixed(1)} / {attempt.quiz?.total_marks}
            </div>
            <div className="text-sm text-gray-500 mt-1">الدرجة</div>
          </div>

          {/* Correct Answers */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {attempt.correct_answers_count} / {attempt.total_questions}
            </div>
            <div className="text-sm text-gray-500 mt-1">إجابات صحيحة</div>
          </div>

          {/* Time */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-700">
              {Math.floor((attempt.time_taken_seconds || 0) / 60)}:{((attempt.time_taken_seconds || 0) % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500 mt-1">الوقت المستغرق</div>
          </div>
        </div>

        {/* Pass/Fail Status */}
        <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
          attempt.is_passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {attempt.is_passed ? (
            <>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">ناجح</div>
                <div className="text-sm text-green-600">
                  لقد اجتزت الاختبار بنجاح. أحسنت!
                </div>
              </div>
            </>
          ) : (
            <>
              <XCircleIcon className="w-8 h-8 text-red-600" />
              <div>
                <div className="font-semibold text-red-800">لم تجتز</div>
                <div className="text-sm text-red-600">
                  نسبة النجاح المطلوبة: {attempt.quiz?.pass_percentage}%
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Answers Review */}
      {showAnswers && questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">مراجعة الإجابات</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {questions.map((question, index) => {
              const answer = getAnswerForQuestion(question.id);
              const isCorrect = answer?.is_correct;
              const selectedOption = answer?.selected_option;
              const correctOption = question.options?.find((o) => o.is_correct);

              return (
                <div key={question.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCorrect === true
                        ? 'bg-green-100 text-green-600'
                        : isCorrect === false
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
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
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {question.question_type_label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {answer?.marks_obtained || 0} / {question.marks} درجة
                        </span>
                      </div>

                      <h4 className="text-gray-900 font-medium mb-3">{question.question_text}</h4>

                      {/* Show options for MCQ and true/false */}
                      {['multiple_choice', 'true_false'].includes(question.question_type) && (
                        <div className="space-y-2">
                          {question.options?.map((option) => {
                            const isSelected = selectedOption?.id === option.id;
                            const isCorrectOption = option.is_correct;

                            let optionClass = 'bg-gray-50 border-gray-200';
                            if (isSelected && isCorrectOption) {
                              optionClass = 'bg-green-50 border-green-300';
                            } else if (isSelected && !isCorrectOption) {
                              optionClass = 'bg-red-50 border-red-300';
                            } else if (isCorrectOption) {
                              optionClass = 'bg-green-50 border-green-300';
                            }

                            return (
                              <div
                                key={option.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${optionClass}`}
                              >
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  isSelected
                                    ? isCorrectOption
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-red-500 bg-red-500'
                                    : isCorrectOption
                                    ? 'border-green-500'
                                    : 'border-gray-300'
                                }`} />
                                <span className={isCorrectOption ? 'text-green-700' : 'text-gray-700'}>
                                  {option.option_text}
                                </span>
                                {isCorrectOption && (
                                  <span className="text-xs text-green-600 mr-auto">(الإجابة الصحيحة)</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Show text answer for short answer and essay */}
                      {['short_answer', 'essay'].includes(question.question_type) && (
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">إجابتك:</div>
                            <div className="text-gray-700">{answer?.answer_text || 'لم تقدم إجابة'}</div>
                          </div>
                          {question.question_type === 'short_answer' && correctOption && (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="text-xs text-green-600 mb-1">الإجابة الصحيحة:</div>
                              <div className="text-green-700">{correctOption.option_text}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-xs text-blue-600 mb-1">الشرح:</div>
                          <div className="text-blue-700 text-sm">{question.explanation}</div>
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
