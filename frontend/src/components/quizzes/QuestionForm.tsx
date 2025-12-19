'use client';

import { useState } from 'react';
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
    const currentOptions = watch('options') || [];
    if (questionType === 'multiple_choice' || questionType === 'true_false') {
      // For MCQ and true/false, only one option can be correct
      currentOptions.forEach((_, i) => {
        setValue(`options.${i}.is_correct`, i === index);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          نوع السؤال *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(QUESTION_TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                questionType === type
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label htmlFor="question_text" className="block text-sm font-medium text-gray-700 mb-1">
          نص السؤال *
        </label>
        <textarea
          id="question_text"
          {...register('question_text')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="اكتب نص السؤال هنا..."
        />
        {errors.question_text && (
          <p className="mt-1 text-sm text-red-600">{errors.question_text.message}</p>
        )}
      </div>

      {/* Marks */}
      <div>
        <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
          الدرجة *
        </label>
        <input
          type="number"
          id="marks"
          {...register('marks', { valueAsNumber: true })}
          step="0.5"
          min="0.01"
          max="100"
          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.marks && (
          <p className="mt-1 text-sm text-red-600">{errors.marks.message}</p>
        )}
      </div>

      {/* Options for multiple choice, true/false, and short answer */}
      {['multiple_choice', 'true_false', 'short_answer'].includes(questionType) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {questionType === 'short_answer' ? 'الإجابات المقبولة' : 'الخيارات *'}
          </label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                {questionType !== 'short_answer' && (
                  <input
                    type="radio"
                    name="correct_option"
                    checked={watch(`options.${index}.is_correct`)}
                    onChange={() => handleCorrectOptionChange(index)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    disabled={questionType === 'true_false'}
                  />
                )}
                <input
                  type="text"
                  {...register(`options.${index}.option_text`)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={questionType === 'short_answer' ? 'إجابة مقبولة' : `الخيار ${index + 1}`}
                  disabled={questionType === 'true_false'}
                />
                {questionType !== 'true_false' && fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {questionType !== 'true_false' && fields.length < 6 && (
            <button
              type="button"
              onClick={() => append({ option_text: '', is_correct: false })}
              className="mt-3 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              إضافة خيار
            </button>
          )}
        </div>
      )}

      {/* Explanation */}
      <div>
        <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-1">
          شرح الإجابة (اختياري)
        </label>
        <textarea
          id="explanation"
          {...register('explanation')}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="شرح يظهر للطالب بعد الإجابة"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الحفظ...' : question ? 'تحديث السؤال' : 'إضافة السؤال'}
        </button>
      </div>
    </form>
  );
}
