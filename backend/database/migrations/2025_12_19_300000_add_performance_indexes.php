<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adding indexes to heavily queried columns for performance optimization.
     */
    public function up(): void
    {
        // Quizzes table indexes
        Schema::table('quizzes', function (Blueprint $table) {
            $table->index('group_id');
            $table->index('is_published');
            $table->index('is_active');
            $table->index(['is_published', 'is_active']);
            $table->index(['available_from', 'available_until']);
        });

        // Quiz questions table indexes
        Schema::table('quiz_questions', function (Blueprint $table) {
            $table->index('quiz_id');
        });

        // Quiz options table indexes
        Schema::table('quiz_options', function (Blueprint $table) {
            $table->index('question_id');
        });

        // Quiz attempts table indexes
        Schema::table('quiz_attempts', function (Blueprint $table) {
            $table->index('quiz_id');
            $table->index('student_id');
            $table->index('status');
            $table->index(['quiz_id', 'student_id']);
            $table->index(['student_id', 'status']);
        });

        // Quiz answers table indexes
        Schema::table('quiz_answers', function (Blueprint $table) {
            $table->index('attempt_id');
            $table->index('question_id');
        });

        // Exams table indexes
        Schema::table('exams', function (Blueprint $table) {
            $table->index('group_id');
            $table->index('status');
            $table->index('exam_date');
            $table->index('is_published');
            $table->index(['group_id', 'status']);
            $table->index(['exam_date', 'status']);
        });

        // Exam results table indexes
        Schema::table('exam_results', function (Blueprint $table) {
            $table->index('student_id');
            $table->index('status');
        });

        // Student profiles - parent_id index for parent queries
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->index('parent_id');
        });

        // Users - parent_id index for parent-child queries
        Schema::table('users', function (Blueprint $table) {
            $table->index('parent_id');
        });

        // Group student pivot - composite index for common joins
        Schema::table('group_student', function (Blueprint $table) {
            $table->index(['student_id', 'group_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Quizzes
        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropIndex(['group_id']);
            $table->dropIndex(['is_published']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_published', 'is_active']);
            $table->dropIndex(['available_from', 'available_until']);
        });

        // Quiz questions
        Schema::table('quiz_questions', function (Blueprint $table) {
            $table->dropIndex(['quiz_id']);
        });

        // Quiz options
        Schema::table('quiz_options', function (Blueprint $table) {
            $table->dropIndex(['question_id']);
        });

        // Quiz attempts
        Schema::table('quiz_attempts', function (Blueprint $table) {
            $table->dropIndex(['quiz_id']);
            $table->dropIndex(['student_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['quiz_id', 'student_id']);
            $table->dropIndex(['student_id', 'status']);
        });

        // Quiz answers
        Schema::table('quiz_answers', function (Blueprint $table) {
            $table->dropIndex(['attempt_id']);
            $table->dropIndex(['question_id']);
        });

        // Exams
        Schema::table('exams', function (Blueprint $table) {
            $table->dropIndex(['group_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['exam_date']);
            $table->dropIndex(['is_published']);
            $table->dropIndex(['group_id', 'status']);
            $table->dropIndex(['exam_date', 'status']);
        });

        // Exam results
        Schema::table('exam_results', function (Blueprint $table) {
            $table->dropIndex(['student_id']);
            $table->dropIndex(['status']);
        });

        // Student profiles
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropIndex(['parent_id']);
        });

        // Users
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['parent_id']);
        });

        // Group student
        Schema::table('group_student', function (Blueprint $table) {
            $table->dropIndex(['student_id', 'group_id']);
        });
    }
};
