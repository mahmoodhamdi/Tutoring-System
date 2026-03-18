'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateQuestionData, QuizQuestion, QUESTION_TYPE_LABELS } from '@/types/quiz';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const optionSchema = z.object({
  option_text: z.string().min(1, 'نص الخيار مطلوب'),
  is_correct: z.boolean(),
});

const questionSchema = z.object({
  question_text: z.string().min(1, 'نص السؤال مطلوب'),
  question_type: z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay']),
  marks: z.number().min(0.01, 'الدرجة يجب أن تكون أكبر من صفر').max(100),
  explanation: z.string().optional(),
  options: z.array(optionSchema).optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  question?: QuizQuestion;
  onSubmit: (data: CreateQuestionData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const inputClass =
  'w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const labelClass = 'block text-sm font-medium text-neutral-700 mb-1';

export function QuestionForm({ question, onSubmit, onCancel, isSubmitting }: QuestionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: question?.question_text || '',
      question_type: question?.question_type || 'multiple_choice',
      marks: question?.marks || 1,
      explanation: question?.explanation || '',
      options: question?.options?.map((opt) => ({
        option_text: opt.option_text,
        is_correct: opt.is_correct || false,
      })) || [
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const questionType = watch('question_type');

  const handleFormSubmit = (data: QuestionFormData) => {
    const submitData: CreateQuestionData = {
      question_text: data.question_text,
      question_type: data.question_type,
      marks: data.marks,
      explanation: data.explanation,
    };

    if (['multiple_choice', 'true_false', 'short_answer'].includes(data.question_type) && data.options) {
      submitData.options = data.options;
    }

    onSubmit(submitData);
  };

  const handleTypeChange = (type: string) => {
    setValue('question_type', type as QuestionFormData['question_type']);

    if (type === 'true_false') {
      setValue('options', [
        { option_text: 'صح', is_correct: true },
        { option_text: 'خطأ', is_correct: false },
      ]);
    } else if (type === 'multiple_choice') {
      setValue('options', [
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ]);
    } else if (type === 'short_answer') {
      setValue('options', [{ option_text: '', is_correct: true }]);
    }
  };

  const handleCorrectOptionChange = (index: number) => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const currentOptions = watch('options') || [];
    if (questionType === 'multiple_choice' || questionType === 'true_false') {
      // For MCQ and true/false, only one option can be correct
      currentOptions.forEach((_, i) => {
        setValue(`options.${i}.is_correct`, i === index);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Question Type */}
      <div>
        <label className={labelClass}>
          نوع السؤال <span className="text-error-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(QUESTION_TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 text-sm rounded-xl border font-medium transition-all duration-200 ${
                questionType === type
                  ? 'bg-primary-50 border-primary-400 text-primary-700 shadow-sm'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label htmlFor="question_text" className={labelClass}>
          نص السؤال <span className="text-error-500">*</span>
        </label>
        <textarea
          id="question_text"
          {...register('question_text')}
          rows={3}
          className={inputClass}
          placeholder="اكتب نص السؤال هنا..."
        />
        {errors.question_text && (
          <p className="mt-1.5 text-sm text-error-600">{errors.question_text.message}</p>
        )}
      </div>

      {/* Marks */}
      <div>
        <label htmlFor="marks" className={labelClass}>
          الدرجة <span className="text-error-500">*</span>
        </label>
        <input
          type="number"
          id="marks"
          {...register('marks', { valueAsNumber: true })}
          step="0.5"
          min="0.01"
          max="100"
          className="w-32 px-3 py-2 border border-neutral-200 rounded-xl bg-white text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
        />
        {errors.marks && (
          <p className="mt-1.5 text-sm text-error-600">{errors.marks.message}</p>
        )}
      </div>

      {/* Options for multiple choice, true/false, and short answer */}
      {['multiple_choice', 'true_false', 'short_answer'].includes(questionType) && (
        <div>
          <label className={labelClass}>
            {questionType === 'short_answer' ? 'الإجابات المقبولة' : 'الخيارات'}{' '}
            <span className="text-error-500">*</span>
          </label>
          <div className="space-y-2.5">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  watch(`options.${index}.is_correct`)
                    ? 'border-success-300 bg-success-50'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                {questionType !== 'short_answer' && (
                  <input
                    type="radio"
                    name="correct_option"
                    checked={watch(`options.${index}.is_correct`)}
                    onChange={() => handleCorrectOptionChange(index)}
                    className="w-4 h-4 text-success-600 border-neutral-300 focus:ring-success-500"
                    disabled={questionType === 'true_false'}
                  />
                )}
                <input
                  type="text"
                  {...register(`options.${index}.option_text`)}
                  className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg bg-white text-neutral-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
                  placeholder={questionType === 'short_answer' ? 'إجابة مقبولة' : `الخيار ${index + 1}`}
                  disabled={questionType === 'true_false'}
                />
                {questionType !== 'true_false' && fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 text-error-500 hover:text-error-700 hover:bg-error-50 rounded-lg transition-all duration-200"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {questionType !== 'true_false' && fields.length < 6 && (
            <button
              type="button"
              onClick={() => append({ option_text: '', is_correct: false })}
              className="mt-3 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              إضافة خيار
            </button>
          )}
        </div>
      )}

      {/* Explanation */}
      <div>
        <label htmlFor="explanation" className={labelClass}>
          شرح الإجابة (اختياري)
        </label>
        <textarea
          id="explanation"
          {...register('explanation')}
          rows={2}
          className={inputClass}
          placeholder="شرح يظهر للطالب بعد الإجابة"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 font-medium transition-all duration-200"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gradient-to-l from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 font-semibold transition-all duration-200"
        >
          {isSubmitting ? 'جاري الحفظ...' : question ? 'تحديث السؤال' : 'إضافة السؤال'}
        </button>
      </div>
    </form>
  );
}
