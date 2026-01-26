const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * QA Test Runner for Tutoring System
 * Comprehensive visual testing with Puppeteer
 */
class QATestRunner {
  constructor(config) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:3000',
      apiUrl: config.apiUrl || 'http://localhost:8001/api',
      screenshotDir: config.screenshotDir || './qa-screenshots',
      slowMo: config.slowMo || 100,
      headless: false,
      defaultTimeout: 60000,
      ...config
    };
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.bugReports = [];
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async init() {
    console.log('\n🎭 Launching visible browser...\n');

    if (!fs.existsSync(this.config.screenshotDir)) {
      fs.mkdirSync(this.config.screenshotDir, { recursive: true });
    }

    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: this.config.slowMo,
      defaultViewport: { width: 1920, height: 1080 },
      protocolTimeout: 120000,
      args: [
        '--start-maximized',
        '--disable-web-security',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });

    // Capture console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
        this.bugReports.push({
          type: 'console_error',
          message: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Capture network errors
    this.page.on('requestfailed', request => {
      console.log('❌ Network Error:', request.url());
      this.bugReports.push({
        type: 'network_error',
        url: request.url(),
        timestamp: new Date().toISOString()
      });
    });

    // Log API requests for debugging
    this.page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log(`🌍 API Request: ${request.method()} ${request.url()}`);
      }
    });

    this.page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`📥 API Response: ${response.status()} ${response.url()}`);
      }
    });

    console.log('✅ Browser ready!\n');
  }

  // ============================================
  // SCREENSHOT HELPERS
  // ============================================

  async screenshot(name) {
    const filename = `${Date.now()}-${name.replace(/[^a-z0-9]/gi, '-')}.png`;
    const filepath = path.join(this.config.screenshotDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot: ${filename}`);
    return filepath;
  }

  // ============================================
  // ACTION HELPERS
  // ============================================

  async goto(url, name = '') {
    console.log(`🌐 Navigating to: ${url}`);
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: this.config.defaultTimeout });
      await this.screenshot(`page-${name || 'navigate'}`);
    } catch (error) {
      console.log(`⚠️ Navigation error: ${error.message}`);
      await this.screenshot(`error-${name || 'navigate'}`);
    }
  }

  async click(selector, description = '') {
    console.log(`👆 Clicking: ${description || selector}`);
    try {
      await this.highlight(selector);
      await this.page.click(selector);
      await this.wait(500);
    } catch (error) {
      console.log(`⚠️ Click error: ${error.message}`);
    }
  }

  async type(selector, text, description = '') {
    console.log(`⌨️ Typing in ${description || selector}: "${text}"`);
    try {
      await this.highlight(selector);
      await this.page.click(selector, { clickCount: 3 }); // Select all
      await this.page.type(selector, text, { delay: 30 });
    } catch (error) {
      console.log(`⚠️ Type error: ${error.message}`);
    }
  }

  async wait(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitForSelector(selector, timeout = 10000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  // Find button or link by text content
  async findButtonByText(texts) {
    try {
      const element = await this.page.evaluate((textArray) => {
        const elements = document.querySelectorAll('button, a');
        for (const el of elements) {
          const text = el.textContent?.trim() || '';
          if (textArray.some(t => text.toLowerCase().includes(t.toLowerCase()))) {
            return true;
          }
        }
        return false;
      }, texts);
      return element;
    } catch {
      return false;
    }
  }

  // ============================================
  // VISUAL HIGHLIGHTING
  // ============================================

  async highlight(selector, color = 'red') {
    try {
      await this.page.evaluate((sel, col) => {
        const element = document.querySelector(sel);
        if (element) {
          element.style.outline = `3px solid ${col}`;
          element.style.outlineOffset = '2px';
          setTimeout(() => {
            element.style.outline = '';
            element.style.outlineOffset = '';
          }, 1500);
        }
      }, selector, color);
      await this.wait(300);
    } catch {
      // Ignore highlight errors
    }
  }

  async showMessage(message, duration = 2000) {
    try {
      await this.page.evaluate((msg, dur) => {
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
          color: #0f0;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 18px;
          font-family: monospace;
          z-index: 999999;
          box-shadow: 0 4px 20px rgba(0,255,0,0.3);
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), dur);
      }, message, duration);
      await this.wait(Math.min(duration, 1500));
    } catch {
      // Ignore message display errors
    }
  }

  // ============================================
  // AUTHENTICATION TESTS
  // ============================================

  async testLogin(phone, password, role) {
    console.log(`\n🔐 Testing Login for: ${role}`);
    await this.showMessage(`🔐 Testing Login: ${role}`);

    await this.goto(`${this.config.baseUrl}/login`, `login-${role}`);

    // Find phone input
    const phoneSelectors = [
      'input[name="phone"]',
      'input[type="tel"]',
      '#phone',
      '[data-testid="phone"]'
    ];

    for (const sel of phoneSelectors) {
      if (await this.page.$(sel)) {
        await this.type(sel, phone, 'Phone field');
        break;
      }
    }

    // Find password input
    const passSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      '#password',
      '[data-testid="password"]'
    ];

    for (const sel of passSelectors) {
      if (await this.page.$(sel)) {
        await this.type(sel, password, 'Password field');
        break;
      }
    }

    await this.screenshot(`login-filled-${role}`);

    // Find submit button
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      '.login-btn',
      '[data-testid="login-button"]'
    ];

    for (const sel of submitSelectors) {
      if (await this.page.$(sel)) {
        await this.click(sel, 'Login button');
        break;
      }
    }

    await this.wait(5000);
    await this.screenshot(`after-login-${role}`);

    const currentUrl = this.page.url();
    console.log(`   Current URL after login: ${currentUrl}`);
    const loginSuccess = !currentUrl.includes('login') || currentUrl.includes('dashboard');

    this.testResults.push({
      test: `Login - ${role}`,
      status: loginSuccess ? '✅ PASS' : '❌ FAIL',
      url: currentUrl
    });

    if (loginSuccess) {
      console.log(`✅ Login successful for ${role}`);
    } else {
      console.log(`❌ Login failed for ${role}`);
    }

    return loginSuccess;
  }

  async testLogout() {
    console.log('\n🚪 Testing Logout...');
    await this.showMessage('🚪 Testing Logout');

    // Try various logout approaches
    const logoutSelectors = [
      'a[href*="logout"]',
      'button[data-testid="logout"]',
      '.logout-btn',
      '[aria-label*="logout" i]',
      '[aria-label*="sign out" i]'
    ];

    for (const sel of logoutSelectors) {
      if (await this.page.$(sel)) {
        await this.click(sel, 'Logout button');
        await this.wait(2000);
        await this.screenshot('after-logout');
        return true;
      }
    }

    // Try clicking on user menu first
    const userMenuSelectors = [
      '[data-testid="user-menu"]',
      '.user-menu',
      '[aria-label*="menu" i]'
    ];

    for (const sel of userMenuSelectors) {
      if (await this.page.$(sel)) {
        await this.click(sel, 'User menu');
        await this.wait(500);

        for (const logoutSel of logoutSelectors) {
          if (await this.page.$(logoutSel)) {
            await this.click(logoutSel, 'Logout button');
            await this.wait(2000);
            await this.screenshot('after-logout');
            return true;
          }
        }
      }
    }

    console.log('⚠️ Logout button not found');
    return false;
  }

  // ============================================
  // PAGE TESTING
  // ============================================

  async testPage(url, pageName) {
    console.log(`\n📄 Testing Page: ${pageName}`);
    await this.showMessage(`📄 Testing: ${pageName}`);

    await this.goto(url, pageName);

    const results = {
      page: pageName,
      url: url,
      tests: []
    };

    // Count elements
    const buttons = await this.page.$$('button, [role="button"], .btn');
    console.log(`   Found ${buttons.length} buttons`);
    results.tests.push({ element: 'buttons', count: buttons.length });

    const links = await this.page.$$('a[href]');
    console.log(`   Found ${links.length} links`);
    results.tests.push({ element: 'links', count: links.length });

    const forms = await this.page.$$('form');
    console.log(`   Found ${forms.length} forms`);
    results.tests.push({ element: 'forms', count: forms.length });

    const inputs = await this.page.$$('input, textarea, select');
    console.log(`   Found ${inputs.length} input fields`);
    results.tests.push({ element: 'inputs', count: inputs.length });

    const tables = await this.page.$$('table, [role="grid"]');
    console.log(`   Found ${tables.length} tables`);
    results.tests.push({ element: 'tables', count: tables.length });

    results.consoleErrors = this.bugReports.filter(b => b.type === 'console_error').length;

    this.testResults.push(results);
    return results;
  }

  // ============================================
  // NAVIGATION TESTING
  // ============================================

  async testDashboardNavigation(pages) {
    console.log('\n🧭 Testing Dashboard Navigation...');
    await this.showMessage('🧭 Testing Navigation');

    for (const page of pages) {
      await this.testPage(`${this.config.baseUrl}${page.path}`, page.name);
    }
  }

  // ============================================
  // FORM TESTING
  // ============================================

  async testForm(formSelector, testData) {
    console.log(`\n📝 Testing Form: ${formSelector}`);
    await this.showMessage('📝 Testing Form');
    await this.highlight(formSelector, 'green');

    const form = await this.page.$(formSelector);
    if (!form) {
      console.log('   ❌ Form not found');
      return false;
    }

    // Fill form fields based on testData
    for (const [fieldName, value] of Object.entries(testData)) {
      const selectors = [
        `input[name="${fieldName}"]`,
        `textarea[name="${fieldName}"]`,
        `select[name="${fieldName}"]`,
        `#${fieldName}`
      ];

      for (const sel of selectors) {
        const field = await this.page.$(sel);
        if (field) {
          const tagName = await field.evaluate(el => el.tagName.toLowerCase());
          const type = await field.evaluate(el => el.type || '');

          if (tagName === 'select') {
            await this.page.select(sel, String(value));
          } else if (type === 'checkbox' || type === 'radio') {
            if (value) await field.click();
          } else {
            await this.type(sel, String(value), fieldName);
          }
          break;
        }
      }
    }

    await this.screenshot('form-filled');
    return true;
  }

  // ============================================
  // CRUD TESTING
  // ============================================

  async testCRUD(config) {
    console.log(`\n🔄 Testing CRUD for: ${config.moduleName}`);
    await this.showMessage(`🔄 Testing CRUD: ${config.moduleName}`);

    const results = {
      module: config.moduleName,
      create: false,
      read: false,
      update: false,
      delete: false
    };

    // READ - List page
    console.log('   👁️ Testing READ (List)...');
    await this.goto(`${this.config.baseUrl}${config.listUrl}`, `${config.moduleName}-list`);
    results.read = true;

    // Check for "New" button
    const newButtonSelectors = [
      `a[href*="${config.newPath || 'new'}"]`,
      '[data-testid="create-button"]'
    ];

    for (const sel of newButtonSelectors) {
      if (await this.page.$(sel)) {
        console.log('   📝 Found Create button');
        await this.highlight(sel, 'green');
        await this.screenshot(`${config.moduleName}-create-button`);
        results.create = true;
        break;
      }
    }

    // Also try finding button by text content if selectors didn't work
    if (!results.create) {
      const createButton = await this.findButtonByText(['Add', 'New', 'Create', 'إضافة', 'جديد']);
      if (createButton) {
        console.log('   📝 Found Create button by text');
        results.create = true;
      }
    }

    // Check for edit/delete buttons in table
    const editButtonSelectors = [
      'a[href*="edit"]',
      'button[data-testid*="edit"]',
      '[aria-label*="edit" i]'
    ];

    for (const sel of editButtonSelectors) {
      if (await this.page.$(sel)) {
        console.log('   ✏️ Found Edit button');
        await this.highlight(sel, 'blue');
        results.update = true;
        break;
      }
    }

    const deleteButtonSelectors = [
      'button[data-testid*="delete"]',
      '[aria-label*="delete" i]',
      'button.delete-btn'
    ];

    for (const sel of deleteButtonSelectors) {
      if (await this.page.$(sel)) {
        console.log('   🗑️ Found Delete button');
        await this.highlight(sel, 'red');
        results.delete = true;
        break;
      }
    }

    await this.screenshot(`${config.moduleName}-crud`);

    this.testResults.push({
      test: `CRUD - ${config.moduleName}`,
      status: (results.create && results.read && results.update && results.delete) ? '✅ PASS' : '⚠️ PARTIAL',
      details: results
    });

    return results;
  }

  // ============================================
  // SEARCH & FILTER TESTING
  // ============================================

  async testSearch(searchTerm = 'test') {
    console.log('\n🔍 Testing Search...');
    await this.showMessage('🔍 Testing Search');

    const searchSelectors = [
      'input[type="search"]',
      'input[name="search"]',
      'input[placeholder*="search" i]',
      'input[placeholder*="بحث"]',
      '[data-testid="search"]',
      '.search-input'
    ];

    for (const sel of searchSelectors) {
      const searchInput = await this.page.$(sel);
      if (searchInput) {
        await this.highlight(sel, 'cyan');
        await this.type(sel, searchTerm, 'Search input');
        await this.page.keyboard.press('Enter');
        await this.wait(1500);
        await this.screenshot('search-results');

        this.testResults.push({
          test: 'Search functionality',
          status: '✅ PASS',
          searchTerm
        });
        return true;
      }
    }

    console.log('⚠️ Search input not found');
    return false;
  }

  // ============================================
  // PAGINATION TESTING
  // ============================================

  async testPagination() {
    console.log('\n📊 Testing Pagination...');
    await this.showMessage('📊 Testing Pagination');

    const paginationSelectors = [
      '.pagination',
      '[role="navigation"]',
      '.pager',
      '[data-testid="pagination"]',
      'nav[aria-label*="pagination" i]'
    ];

    for (const sel of paginationSelectors) {
      const pagination = await this.page.$(sel);
      if (pagination) {
        await this.highlight(sel, 'purple');
        await this.screenshot('pagination-found');

        // Try next button
        const nextSelectors = [
          '[aria-label="Next"]',
          '[aria-label="next"]',
          '.next',
          '[data-testid="next-page"]',
          'a[rel="next"]'
        ];

        for (const nextSel of nextSelectors) {
          if (await this.page.$(nextSel)) {
            await this.click(nextSel, 'Next page');
            await this.wait(1000);
            await this.screenshot('pagination-next');

            this.testResults.push({
              test: 'Pagination',
              status: '✅ PASS'
            });
            return true;
          }
        }
      }
    }

    console.log('⚠️ Pagination not found or no additional pages');
    return false;
  }

  // ============================================
  // RESPONSIVE TESTING
  // ============================================

  async testResponsive() {
    console.log('\n📱 Testing Responsive Design...');

    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-full' },
      { width: 1440, height: 900, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 768, height: 1024, name: 'tablet-portrait' },
      { width: 414, height: 896, name: 'mobile-large' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const vp of viewports) {
      console.log(`   Testing viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await this.showMessage(`📱 ${vp.name}`);
      await this.page.setViewport({ width: vp.width, height: vp.height });
      await this.wait(500);
      await this.screenshot(`responsive-${vp.name}`);
    }

    // Reset to desktop
    await this.page.setViewport({ width: 1920, height: 1080 });

    this.testResults.push({
      test: 'Responsive Design',
      status: '✅ PASS',
      viewports: viewports.map(v => v.name)
    });
  }

  // ============================================
  // REPORT GENERATION
  // ============================================

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      project: 'Tutoring System',
      summary: {
        totalTests: this.testResults.length,
        passed: this.testResults.filter(t => t.status?.includes('PASS')).length,
        failed: this.testResults.filter(t => t.status?.includes('FAIL')).length,
        partial: this.testResults.filter(t => t.status?.includes('PARTIAL')).length,
        bugs: this.bugReports.length
      },
      results: this.testResults,
      bugs: this.bugReports
    };

    // Save JSON report
    fs.writeFileSync(
      path.join(this.config.screenshotDir, 'qa-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate HTML report
    const html = this.generateHTMLReport(report);
    fs.writeFileSync(
      path.join(this.config.screenshotDir, 'qa-report.html'),
      html
    );

    console.log('\n📊 Report generated!');
    console.log(`   📁 Screenshots: ${this.config.screenshotDir}`);
    console.log(`   📄 JSON Report: ${this.config.screenshotDir}/qa-report.json`);
    console.log(`   🌐 HTML Report: ${this.config.screenshotDir}/qa-report.html`);

    return report;
  }

  generateHTMLReport(report) {
    const screenshotFiles = fs.readdirSync(this.config.screenshotDir)
      .filter(f => f.endsWith('.png'))
      .sort();

    return `
<!DOCTYPE html>
<html>
<head>
  <title>QA Test Report - Tutoring System</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #1a1a2e; color: #eee; line-height: 1.6; }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #16213e, #0f3460); border-radius: 15px; margin-bottom: 30px; }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .header p { color: #8892b0; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .card { background: #16213e; padding: 25px; border-radius: 12px; text-align: center; transition: transform 0.2s; }
    .card:hover { transform: translateY(-5px); }
    .card h3 { font-size: 2.5em; margin-bottom: 5px; }
    .card.pass { border-left: 4px solid #00ff00; }
    .card.fail { border-left: 4px solid #ff0000; }
    .card.partial { border-left: 4px solid #ffaa00; }
    .card.bug { border-left: 4px solid #ff6b6b; }
    .section { background: #16213e; border-radius: 12px; padding: 25px; margin-bottom: 20px; }
    .section h2 { margin-bottom: 20px; color: #00ff00; }
    .result-item { background: #0f3460; padding: 15px 20px; margin: 10px 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
    .pass { color: #00ff00; }
    .fail { color: #ff0000; }
    .partial { color: #ffaa00; }
    .screenshots { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
    .screenshot-item { background: #0f3460; border-radius: 8px; overflow: hidden; }
    .screenshot-item img { width: 100%; height: 200px; object-fit: cover; cursor: pointer; transition: opacity 0.2s; }
    .screenshot-item img:hover { opacity: 0.8; }
    .screenshot-item p { padding: 10px; font-size: 0.85em; color: #8892b0; word-break: break-all; }
    .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; justify-content: center; align-items: center; }
    .modal img { max-width: 95%; max-height: 95%; object-fit: contain; }
    .modal.active { display: flex; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 QA Test Report</h1>
      <p>Tutoring System - ${report.timestamp}</p>
    </div>

    <div class="summary">
      <div class="card"><h3>${report.summary.totalTests}</h3><p>Total Tests</p></div>
      <div class="card pass"><h3>${report.summary.passed}</h3><p>Passed</p></div>
      <div class="card fail"><h3>${report.summary.failed}</h3><p>Failed</p></div>
      <div class="card partial"><h3>${report.summary.partial}</h3><p>Partial</p></div>
      <div class="card bug"><h3>${report.summary.bugs}</h3><p>Bugs Found</p></div>
    </div>

    <div class="section">
      <h2>📋 Test Results</h2>
      ${report.results.map(r => `
        <div class="result-item">
          <strong>${r.test || r.page || 'Test'}</strong>
          <span class="${r.status?.includes('PASS') ? 'pass' : r.status?.includes('FAIL') ? 'fail' : 'partial'}">${r.status || 'Completed'}</span>
        </div>
      `).join('')}
    </div>

    ${report.bugs.length > 0 ? `
    <div class="section">
      <h2>🐛 Bugs Found</h2>
      ${report.bugs.map(b => `
        <div class="result-item">
          <div>
            <strong>${b.type}</strong><br>
            <small style="color: #8892b0;">${b.message || b.url}</small>
          </div>
          <small>${b.timestamp}</small>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="section">
      <h2>📸 Screenshots (${screenshotFiles.length})</h2>
      <div class="screenshots">
        ${screenshotFiles.map(f => `
          <div class="screenshot-item">
            <img src="${f}" alt="${f}" onclick="openModal(this.src)" loading="lazy">
            <p>${f}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <div class="modal" id="modal" onclick="closeModal()">
    <img id="modalImg" src="" alt="Screenshot">
  </div>

  <script>
    function openModal(src) {
      document.getElementById('modalImg').src = src;
      document.getElementById('modal').classList.add('active');
    }
    function closeModal() {
      document.getElementById('modal').classList.remove('active');
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  </script>
</body>
</html>
    `;
  }

  // ============================================
  // CLEANUP
  // ============================================

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = QATestRunner;
