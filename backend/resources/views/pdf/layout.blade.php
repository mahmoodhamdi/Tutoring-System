<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>@yield('title', 'تقرير')</title>
    <style>
        @font-face {
            font-family: 'DejaVu Sans';
            src: url('{{ storage_path('fonts/DejaVuSans.ttf') }}');
        }

        * {
            font-family: 'DejaVu Sans', sans-serif;
            box-sizing: border-box;
        }

        body {
            direction: rtl;
            text-align: right;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .header h1 {
            color: #0284c7;
            font-size: 24px;
            margin: 0 0 10px 0;
        }

        .header .subtitle {
            color: #666;
            font-size: 14px;
        }

        .meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 11px;
            color: #666;
        }

        .filters {
            background: #f8fafc;
            padding: 10px 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 11px;
        }

        .filters span {
            margin-left: 20px;
        }

        .summary {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .summary-item {
            display: table-cell;
            text-align: center;
            padding: 15px;
            background: #f0f9ff;
            border-radius: 5px;
        }

        .summary-item .value {
            font-size: 24px;
            font-weight: bold;
            color: #0284c7;
        }

        .summary-item .label {
            font-size: 11px;
            color: #666;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th, td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: right;
        }

        th {
            background: #0284c7;
            color: white;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background: #f8fafc;
        }

        .status-present, .status-paid {
            color: #22c55e;
            font-weight: bold;
        }

        .status-absent, .status-overdue {
            color: #ef4444;
            font-weight: bold;
        }

        .status-late, .status-pending {
            color: #f59e0b;
            font-weight: bold;
        }

        .status-excused, .status-partial {
            color: #3b82f6;
            font-weight: bold;
        }

        .footer {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }

        .page-break {
            page-break-after: always;
        }

        .text-center {
            text-align: center;
        }

        .text-left {
            text-align: left;
        }

        .font-bold {
            font-weight: bold;
        }

        .text-success { color: #22c55e; }
        .text-danger { color: #ef4444; }
        .text-warning { color: #f59e0b; }
        .text-info { color: #3b82f6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>@yield('title', 'تقرير')</h1>
        <div class="subtitle">نظام إدارة الدروس الخصوصية</div>
    </div>

    @yield('content')

    <div class="footer">
        تم إنشاء هذا التقرير بتاريخ {{ $generatedAt }} | نظام إدارة الدروس الخصوصية
    </div>
</body>
</html>
