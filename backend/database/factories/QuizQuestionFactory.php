<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizQuestion>
 */
class QuizQuestionFactory extends Factory
{
    protected $model = QuizQuestion::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quiz_id' => Quiz::factory(),
            'question_text' => fake()->sentence() . '؟',
            'question_type' => 'multiple_choice',
            'marks' => fake()->randomElement([1, 2, 3, 5, 10]),
            'order_index' => 1,
            'explanation' => fake()->optional()->paragraph(),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (QuizQuestion $question) {
            // Create options based on question type
            if (in_array($question->question_type, ['multiple_choice', 'true_false'])) {
                $this->createOptionsForQuestion($question);
            }
        });
    }

    /**
     * Create options for a question.
     */
    protected function createOptionsForQuestion(QuizQuestion $question): void
    {
        if ($question->question_type === 'true_false') {
            \App\Models\QuizOption::factory()->create([
                'question_id' => $question->id,
                'option_text' => 'صح',
                'is_correct' => true,
                'order_index' => 1,
            ]);
            \App\Models\QuizOption::factory()->create([
                'question_id' => $question->id,
                'option_text' => 'خطأ',
                'is_correct' => false,
                'order_index' => 2,
            ]);
        } else {
            $optionCount = fake()->numberBetween(3, 5);
            $correctIndex = fake()->numberBetween(0, $optionCount - 1);

            for ($i = 0; $i < $optionCount; $i++) {
                \App\Models\QuizOption::factory()->create([
                    'question_id' => $question->id,
                    'option_text' => fake()->sentence(),
                    'is_correct' => $i === $correctIndex,
                    'order_index' => $i + 1,
                ]);
            }
        }
    }

    /**
     * Multiple choice question.
     */
    public function multipleChoice(): static
    {
        return $this->state(fn(array $attributes) => [
            'question_type' => 'multiple_choice',
        ]);
    }

    /**
     * True/False question.
     */
    public function trueFalse(): static
    {
        return $this->state(fn(array $attributes) => [
            'question_type' => 'true_false',
        ]);
    }

    /**
     * Short answer question.
     */
    public function shortAnswer(): static
    {
        return $this->state(fn(array $attributes) => [
            'question_type' => 'short_answer',
        ])->afterCreating(function (QuizQuestion $question) {
            // Create correct answer options
            \App\Models\QuizOption::factory()->count(fake()->numberBetween(1, 3))->create([
                'question_id' => $question->id,
                'is_correct' => true,
            ]);
        });
    }

    /**
     * Essay question.
     */
    public function essay(): static
    {
        return $this->state(fn(array $attributes) => [
            'question_type' => 'essay',
        ]);
    }
}
