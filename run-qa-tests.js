const QATestRunner = require('./qa-test-runner');

// ============================================
// CONFIGURATION - TUTORING SYSTEM
// ============================================

const config = {
  baseUrl: 'http://localhost:3000',
  apiUrl: 'http://localhost:8001/api',
  screenshotDir: './qa-screenshots',
  slowMo: 80,

  // Test users from DemoSeeder.php
  users: [
    { role: 'teacher', phone: '01111111111', password: 'password' },
    { role: 'admin', phone: '01000000000', password: 'password' },
    { role: 'student', phone: '01122222220', password: 'password' },
  ],

  // Dashboard pages to test (for teacher/admin)
  dashboardPages: [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/dashboard/students' },
    { name: 'Groups', path: '/dashboard/groups' },
    { name: 'Schedule', path: '/dashboard/schedule' },
    { name: 'Payments', path: '/dashboard/payments' },
    { name: 'Exams', path: '/dashboard/exams' },
    { name: 'Quizzes', path: '/dashboard/quizzes' },
    { name: 'Announcements', path: '/dashboard/announcements' },
    { name: 'Notifications', path: '/dashboard/notifications' },
    { name: 'Reports', path: '/dashboard/reports' },
    { name: 'Settings', path: '/dashboard/settings' },
  ],

  // Portal pages to test (for student)
  portalPages: [
    { name: 'Portal Dashboard', path: '/portal/dashboard' },
    { name: 'Attendance', path: '/portal/attendance' },
    { name: 'Grades', path: '/portal/grades' },
  ],

  // CRUD modules to test
  modules: [
    {
      moduleName: 'Students',
      listUrl: '/dashboard/students',
      newPath: '/dashboard/students/new'
    },
    {
      moduleName: 'Groups',
      listUrl: '/dashboard/groups',
      newPath: '/dashboard/groups/new'
    },
    {
      moduleName: 'Sessions',
      listUrl: '/dashboard/schedule',
      newPath: '/dashboard/schedule/new'
    },
    {
      moduleName: 'Payments',
      listUrl: '/dashboard/payments',
      newPath: '/dashboard/payments/new'
    },
    {
      moduleName: 'Exams',
      listUrl: '/dashboard/exams',
      newPath: '/dashboard/exams/new'
    },
    {
      moduleName: 'Quizzes',
      listUrl: '/dashboard/quizzes',
      newPath: '/dashboard/quizzes/new'
    },
    {
      moduleName: 'Announcements',
      listUrl: '/dashboard/announcements',
      newPath: '/dashboard/announcements/new'
    }
  ]
};

// ============================================
// MAIN TEST EXECUTION
// ============================================

async function runTests() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           🎯 TUTORING SYSTEM QA TESTING                          ║
║                                                                  ║
║   Base URL: ${config.baseUrl}                              ║
║   API URL: ${config.apiUrl}                            ║
╚══════════════════════════════════════════════════════════════════╝
  `);

  const qa = new QATestRunner(config);

  try {
    await qa.init();

    // ============================================
    // PHASE 2: AUTHENTICATION TESTING
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('🔐 PHASE 2: AUTHENTICATION TESTING');
    console.log('='.repeat(60));

    // Test Teacher login
    const teacherLogin = await qa.testLogin(
      config.users[0].phone,
      config.users[0].password,
      config.users[0].role
    );

    if (teacherLogin) {
      // ============================================
      // PHASE 3: DASHBOARD NAVIGATION TESTING
      // ============================================
      console.log('\n' + '='.repeat(60));
      console.log('🧭 PHASE 3: DASHBOARD NAVIGATION TESTING');
      console.log('='.repeat(60));

      await qa.testDashboardNavigation(config.dashboardPages);

      // ============================================
      // PHASE 4: CRUD TESTING
      // ============================================
      console.log('\n' + '='.repeat(60));
      console.log('🔄 PHASE 4: CRUD TESTING');
      console.log('='.repeat(60));

      for (const module of config.modules) {
        await qa.testCRUD(module);
      }

      // ============================================
      // PHASE 5: SEARCH & PAGINATION TESTING
      // ============================================
      console.log('\n' + '='.repeat(60));
      console.log('🔍 PHASE 5: SEARCH & PAGINATION TESTING');
      console.log('='.repeat(60));

      // Go to students page for search/pagination testing
      await qa.goto(`${config.baseUrl}/dashboard/students`, 'students-for-search');
      await qa.testSearch('student');
      await qa.testPagination();

      // ============================================
      // PHASE 6: RESPONSIVE TESTING
      // ============================================
      console.log('\n' + '='.repeat(60));
      console.log('📱 PHASE 6: RESPONSIVE TESTING');
      console.log('='.repeat(60));

      await qa.testResponsive();

      // Logout
      await qa.testLogout();
    }

    // ============================================
    // PHASE 7: STUDENT PORTAL TESTING
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('🎓 PHASE 7: STUDENT PORTAL TESTING');
    console.log('='.repeat(60));

    // Navigate to portal login
    await qa.goto(`${config.baseUrl}/portal`, 'portal-home');

    // Try student login on portal (if separate login exists)
    // Note: The portal might use the same /login page or have its own

    // ============================================
    // PHASE 8: GENERATE FINAL REPORT
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 PHASE 8: GENERATING FINAL REPORT');
    console.log('='.repeat(60));

    const report = qa.generateReport();

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              ✅ QA TESTING COMPLETE                              ║
╠══════════════════════════════════════════════════════════════════╣
║   Total Tests:    ${String(report.summary.totalTests).padEnd(42)}║
║   Passed:         ${String(report.summary.passed).padEnd(42)}║
║   Failed:         ${String(report.summary.failed).padEnd(42)}║
║   Partial:        ${String(report.summary.partial).padEnd(42)}║
║   Bugs Found:     ${String(report.summary.bugs).padEnd(42)}║
╠══════════════════════════════════════════════════════════════════╣
║   Screenshots: ./qa-screenshots/                                 ║
║   Report: ./qa-screenshots/qa-report.html                        ║
╚══════════════════════════════════════════════════════════════════╝
    `);

  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    console.log('\n⏳ Browser will close in 10 seconds...');
    console.log('   Press Ctrl+C to close immediately.\n');
    await new Promise(r => setTimeout(r, 10000));
    await qa.close();
  }
}

// Run tests
runTests().catch(console.error);
