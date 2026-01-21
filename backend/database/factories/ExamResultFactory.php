<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamResultFactory extends Factory
{
    public function definition(): array
    {
        return [
            'exam_id' => Exam::factory(),
            'student_id' => User::factory()->state(['role' => 'student']),
            'marks_obtained' => null,
            'percentage' => null,
            'grade' => null,
            'status' => 'pending',
            'feedback' => null,
            'graded_by' => null,
            'graded_at' => null,
        ];
    }

    public function graded(): static
    {
        return $this->state(function (array $attributes) {
            $examId = $attributes['exam_id'];
            if ($examId instanceof \Illuminate\Database\Eloquent\Factories\Factory) {
                $exam = $examId->create();
            } elseif ($examId instanceof Exam) {
                $exam = $examId;
            } else {
                $exam = Exam::find($examId) ?? Exam::factory()->create();
            }

            $totalMarks = $exam->total_marks ?? 100;
            $marks = $this->faker->randomFloat(2, 0, $totalMarks);
            $percentage = ($marks / $totalMarks) * 100;
            $grade = match (true) {
                $percentage >= 95 => 'A+',
                $percentage >= 90 => 'A',
                $percentage >= 85 => 'B+',
                $percentage >= 80 => 'B',
                $percentage >= 75 => 'C+',
                $percentage >= 70 => 'C',
                $percentage >= 60 => 'D',
                default => 'F',
            };

            return [
                'exam_id' => $exam->id,
                'marks_obtained' => $marks,
                'percentage' => round($percentage, 2),
                'grade' => $grade,
                'status' => 'graded',
                'graded_by' => User::factory()->state(['role' => 'teacher']),
                'graded_at' => now(),
            ];
        });
    }

    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'marks_obtained' => 0,
            'percentage' => 0,
            'grade' => 'F',
            'status' => 'absent',
        ]);
    }

    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'submitted',
        ]);
    }

    public function passed(): static
    {
        return $this->state(function (array $attributes) {
            $examId = $attributes['exam_id'];
            if ($examId instanceof \Illuminate\Database\Eloquent\Factories\Factory) {
                $exam = $examId->create();
            } elseif ($examId instanceof Exam) {
                $exam = $examId;
            } else {
                $exam = Exam::find($examId) ?? Exam::factory()->create();
            }

            $totalMarks = $exam->total_marks ?? 100;
            $passMarks = $exam->pass_marks ?? ($totalMarks * 0.6);
            $marks = $this->faker->randomFloat(2, $passMarks, $totalMarks);
            $percentage = ($marks / $totalMarks) * 100;

            return [
                'exam_id' => $exam->id,
                'marks_obtained' => $marks,
                'percentage' => round($percentage, 2),
                'grade' => match (true) {
                    $percentage >= 95 => 'A+',
                    $percentage >= 90 => 'A',
                    $percentage >= 85 => 'B+',
                    $percentage >= 80 => 'B',
                    $percentage >= 75 => 'C+',
                    $percentage >= 70 => 'C',
                    default => 'D',
                },
                'status' => 'graded',
                'graded_by' => User::factory()->state(['role' => 'teacher']),
                'graded_at' => now(),
            ];
        });
    }
}
