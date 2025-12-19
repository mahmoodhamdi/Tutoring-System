<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\StudentProfile;
use App\Models\Group;
use App\Models\Session;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizOption;
use App\Models\QuizAttempt;
use App\Models\QuizAnswer;
use App\Models\Announcement;
use App\Models\Notification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DemoSeeder extends Seeder
{
    /**
     * Seed the application with demo data for testing.
     */
    public function run(): void
    {
        $this->command->info('Seeding demo data...');

        // Create admin user
        $admin = User::create([
            'name' => 'مدير النظام',
            'email' => 'admin@example.com',
            'phone' => '01000000000',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create teacher user
        $teacher = User::create([
            'name' => 'أحمد المعلم',
            'email' => 'teacher@example.com',
            'phone' => '01111111111',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->command->info('Created admin and teacher users');

        // Create parent users
        $parents = [];
        $parentNames = ['محمد علي', 'أحمد حسن', 'إبراهيم سعيد', 'خالد عبدالله', 'سامي الرشيدي'];
        foreach ($parentNames as $index => $name) {
            $parents[] = User::create([
                'name' => $name,
                'email' => "parent{$index}@example.com",
                'phone' => '0100000000' . ($index + 1),
                'password' => Hash::make('password'),
                'role' => 'parent',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }

        $this->command->info('Created parent users');

        // Create student users with profiles
        $students = [];
        $studentNames = [
            'يوسف محمد', 'أحمد علي', 'عمر حسن', 'محمود سعيد', 'كريم عبدالله',
            'سارة أحمد', 'فاطمة محمد', 'نور الهدى', 'مريم خالد', 'ريم إبراهيم',
            'حسين علي', 'علي حسن', 'محمد يوسف', 'عبدالرحمن أحمد', 'زياد محمود',
        ];

        foreach ($studentNames as $index => $name) {
            $student = User::create([
                'name' => $name,
                'email' => "student{$index}@example.com",
                'phone' => '0112222222' . $index,
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            // Create student profile
            StudentProfile::create([
                'user_id' => $student->id,
                'parent_id' => $parents[$index % count($parents)]->id,
                'grade_level' => ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'][$index % 3],
                'school_name' => 'مدرسة النور',
                'address' => 'القاهرة، مصر',
                'enrollment_date' => now()->subMonths(rand(1, 12)),
                'notes' => 'طالب مجتهد',
            ]);

            $students[] = $student;
        }

        $this->command->info('Created ' . count($students) . ' students');

        // Create groups
        $groups = [];
        $groupData = [
            ['name' => 'مجموعة الرياضيات - الصف الأول', 'subject' => 'الرياضيات', 'grade_level' => 'الصف الأول الثانوي', 'max_students' => 20, 'fee_amount' => 500],
            ['name' => 'مجموعة الرياضيات - الصف الثاني', 'subject' => 'الرياضيات', 'grade_level' => 'الصف الثاني الثانوي', 'max_students' => 20, 'fee_amount' => 600],
            ['name' => 'مجموعة الرياضيات - الصف الثالث', 'subject' => 'الرياضيات', 'grade_level' => 'الصف الثالث الثانوي', 'max_students' => 15, 'fee_amount' => 700],
            ['name' => 'مجموعة الفيزياء', 'subject' => 'الفيزياء', 'grade_level' => 'الصف الثالث الثانوي', 'max_students' => 15, 'fee_amount' => 700],
        ];

        foreach ($groupData as $data) {
            $groups[] = Group::create(array_merge($data, [
                'teacher_id' => $teacher->id,
                'is_active' => true,
                'schedule' => json_encode(['السبت' => '16:00-18:00', 'الثلاثاء' => '16:00-18:00']),
            ]));
        }

        $this->command->info('Created ' . count($groups) . ' groups');

        // Assign students to groups
        foreach ($students as $index => $student) {
            $groupIndex = $index % count($groups);
            $groups[$groupIndex]->students()->attach($student->id, [
                'joined_at' => now()->subMonths(rand(1, 6)),
                'is_active' => true,
            ]);
        }

        $this->command->info('Assigned students to groups');

        // Create sessions for the past 2 months and next month
        $sessions = [];
        $startDate = now()->subMonths(2);
        $endDate = now()->addMonth();

        foreach ($groups as $group) {
            $currentDate = $startDate->copy();
            while ($currentDate <= $endDate) {
                // Create sessions for Saturday and Tuesday
                if ($currentDate->isSaturday() || $currentDate->isTuesday()) {
                    $session = Session::create([
                        'group_id' => $group->id,
                        'title' => 'جلسة ' . $currentDate->format('Y-m-d'),
                        'session_date' => $currentDate->toDateString(),
                        'start_time' => '16:00',
                        'end_time' => '18:00',
                        'status' => $currentDate->isPast() ? 'completed' : 'scheduled',
                        'topic' => 'الموضوع: ' . ['الجبر', 'الهندسة', 'حساب المثلثات', 'التفاضل والتكامل'][rand(0, 3)],
                        'notes' => null,
                    ]);
                    $sessions[] = $session;
                }
                $currentDate->addDay();
            }
        }

        $this->command->info('Created ' . count($sessions) . ' sessions');

        // Create attendance records for past sessions
        $attendanceStatuses = ['present', 'present', 'present', 'present', 'late', 'absent', 'excused'];
        foreach ($sessions as $session) {
            if ($session->status === 'completed') {
                $groupStudents = $session->group->students;
                foreach ($groupStudents as $student) {
                    Attendance::create([
                        'session_id' => $session->id,
                        'student_id' => $student->id,
                        'status' => $attendanceStatuses[array_rand($attendanceStatuses)],
                        'notes' => rand(0, 10) > 8 ? 'ملاحظة على الحضور' : null,
                        'marked_by' => $teacher->id,
                    ]);
                }
            }
        }

        $this->command->info('Created attendance records');

        // Create payments for each student
        $paymentStatuses = ['paid', 'paid', 'paid', 'pending', 'overdue'];
        $paymentMethods = ['cash', 'bank_transfer', 'card'];

        foreach ($students as $student) {
            // Monthly payments for the past 3 months
            for ($i = 0; $i < 3; $i++) {
                $dueDate = now()->subMonths($i)->startOfMonth();
                $status = $paymentStatuses[array_rand($paymentStatuses)];

                Payment::create([
                    'student_id' => $student->id,
                    'amount' => [500, 600, 700][rand(0, 2)],
                    'due_date' => $dueDate,
                    'paid_at' => $status === 'paid' ? $dueDate->addDays(rand(0, 5)) : null,
                    'status' => $status,
                    'payment_method' => $status === 'paid' ? $paymentMethods[array_rand($paymentMethods)] : null,
                    'description' => 'أتعاب شهر ' . $dueDate->locale('ar')->translatedFormat('F Y'),
                    'notes' => null,
                ]);
            }
        }

        $this->command->info('Created payment records');

        // Create exams
        $exams = [];
        foreach ($groups as $group) {
            // Create 2 exams per group
            for ($i = 0; $i < 2; $i++) {
                $examDate = now()->subWeeks(rand(1, 8));
                $exam = Exam::create([
                    'group_id' => $group->id,
                    'title' => ($i === 0 ? 'امتحان نصف الترم' : 'امتحان آخر الترم') . ' - ' . $group->name,
                    'description' => 'امتحان شامل على المنهج',
                    'exam_date' => $examDate,
                    'duration_minutes' => 90,
                    'total_marks' => 100,
                    'pass_marks' => 50,
                    'status' => 'completed',
                ]);
                $exams[] = $exam;

                // Create results for students in this group
                $groupStudents = $group->students;
                foreach ($groupStudents as $student) {
                    $obtainedMarks = rand(30, 100);
                    ExamResult::create([
                        'exam_id' => $exam->id,
                        'student_id' => $student->id,
                        'obtained_marks' => $obtainedMarks,
                        'percentage' => $obtainedMarks,
                        'is_passed' => $obtainedMarks >= 50,
                        'grade' => $this->calculateGrade($obtainedMarks),
                        'notes' => null,
                    ]);
                }
            }
        }

        $this->command->info('Created ' . count($exams) . ' exams with results');

        // Create quizzes
        $quizzes = [];
        foreach ($groups as $group) {
            for ($i = 0; $i < 3; $i++) {
                $quiz = Quiz::create([
                    'group_id' => $group->id,
                    'title' => 'اختبار قصير ' . ($i + 1) . ' - ' . $group->name,
                    'description' => 'اختبار قصير على الدرس',
                    'duration_minutes' => 15,
                    'pass_percentage' => 60,
                    'is_active' => true,
                    'start_time' => now()->subWeeks(rand(1, 4)),
                    'end_time' => now()->addWeeks(1),
                ]);
                $quizzes[] = $quiz;

                // Create questions
                for ($q = 0; $q < 5; $q++) {
                    $question = QuizQuestion::create([
                        'quiz_id' => $quiz->id,
                        'question_text' => 'سؤال رقم ' . ($q + 1) . ': ما هي الإجابة الصحيحة؟',
                        'question_type' => 'multiple_choice',
                        'points' => 2,
                        'order' => $q + 1,
                    ]);

                    // Create options
                    $correctOption = rand(0, 3);
                    for ($o = 0; $o < 4; $o++) {
                        QuizOption::create([
                            'question_id' => $question->id,
                            'option_text' => 'الإجابة ' . ($o + 1),
                            'is_correct' => $o === $correctOption,
                            'order' => $o + 1,
                        ]);
                    }
                }

                // Create attempts for some students
                $groupStudents = $group->students->random(rand(3, $group->students->count()));
                foreach ($groupStudents as $student) {
                    $score = rand(3, 10);
                    $attempt = QuizAttempt::create([
                        'quiz_id' => $quiz->id,
                        'student_id' => $student->id,
                        'started_at' => now()->subDays(rand(1, 7)),
                        'submitted_at' => now()->subDays(rand(0, 6)),
                        'score' => $score,
                        'total_points' => 10,
                        'percentage' => $score * 10,
                        'is_passed' => $score >= 6,
                        'status' => 'graded',
                    ]);
                }
            }
        }

        $this->command->info('Created ' . count($quizzes) . ' quizzes');

        // Create announcements
        $announcements = [
            ['title' => 'بداية العام الدراسي الجديد', 'content' => 'نرحب بكم في العام الدراسي الجديد ونتمنى لكم عاماً دراسياً موفقاً.', 'priority' => 'high', 'is_pinned' => true],
            ['title' => 'موعد امتحان نصف الترم', 'content' => 'يبدأ امتحان نصف الترم الأسبوع القادم. يرجى الاستعداد جيداً.', 'priority' => 'high', 'is_pinned' => false],
            ['title' => 'إجازة عيد الفطر', 'content' => 'ستكون الدروس معطلة خلال إجازة عيد الفطر المبارك.', 'priority' => 'medium', 'is_pinned' => false],
            ['title' => 'مراجعة شاملة', 'content' => 'ستعقد مراجعة شاملة على المنهج يوم السبت القادم.', 'priority' => 'low', 'is_pinned' => false],
        ];

        foreach ($announcements as $data) {
            Announcement::create(array_merge($data, [
                'created_by' => $admin->id,
                'published_at' => now()->subDays(rand(0, 30)),
                'expires_at' => now()->addMonths(1),
            ]));
        }

        $this->command->info('Created announcements');

        // Create notifications
        foreach ($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'type' => 'payment_reminder',
                'title' => 'تذكير بالدفع',
                'message' => 'يرجى سداد المستحقات المالية.',
                'data' => json_encode(['amount' => 500]),
                'is_read' => rand(0, 1),
            ]);
        }

        $this->command->info('Created notifications');

        $this->command->newLine();
        $this->command->info('Demo data seeding completed!');
        $this->command->newLine();
        $this->command->table(
            ['Entity', 'Count'],
            [
                ['Admin Users', 1],
                ['Teacher Users', 1],
                ['Parent Users', count($parents)],
                ['Students', count($students)],
                ['Groups', count($groups)],
                ['Sessions', count($sessions)],
                ['Exams', count($exams)],
                ['Quizzes', count($quizzes)],
            ]
        );
        $this->command->newLine();
        $this->command->info('Login credentials:');
        $this->command->line('Admin: admin@example.com / password');
        $this->command->line('Teacher: teacher@example.com / password');
        $this->command->line('Student: student0@example.com / password');
    }

    /**
     * Calculate grade based on percentage
     */
    private function calculateGrade(float $percentage): string
    {
        return match (true) {
            $percentage >= 90 => 'A+',
            $percentage >= 85 => 'A',
            $percentage >= 80 => 'B+',
            $percentage >= 75 => 'B',
            $percentage >= 70 => 'C+',
            $percentage >= 65 => 'C',
            $percentage >= 60 => 'D+',
            $percentage >= 50 => 'D',
            default => 'F',
        };
    }
}
