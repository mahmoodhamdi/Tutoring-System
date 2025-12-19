<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected string $provider;
    protected ?string $apiKey;
    protected ?string $apiSecret;
    protected ?string $senderId;

    public function __construct()
    {
        $this->provider = config('services.sms.provider', 'log');
        $this->apiKey = config('services.sms.api_key');
        $this->apiSecret = config('services.sms.api_secret');
        $this->senderId = config('services.sms.sender_id', 'TUTORING');
    }

    /**
     * Send SMS message
     */
    public function send(string $phone, string $message): bool
    {
        // Normalize phone number
        $phone = $this->normalizePhone($phone);

        if (!$this->isValidPhone($phone)) {
            Log::warning("Invalid phone number: {$phone}");
            return false;
        }

        return match ($this->provider) {
            'twilio' => $this->sendViaTwilio($phone, $message),
            'vonage' => $this->sendViaVonage($phone, $message),
            'gateway_sa' => $this->sendViaGatewaySa($phone, $message),
            default => $this->sendViaLog($phone, $message),
        };
    }

    /**
     * Send bulk SMS messages
     */
    public function sendBulk(array $recipients, string $message): array
    {
        $results = [];
        foreach ($recipients as $phone) {
            $results[$phone] = $this->send($phone, $message);
        }
        return $results;
    }

    /**
     * Send payment reminder
     */
    public function sendPaymentReminder(string $phone, string $studentName, float $amount, string $dueDate): bool
    {
        $message = "تذكير بالدفع: الطالب {$studentName} - المبلغ المستحق: {$amount} ج.م - تاريخ الاستحقاق: {$dueDate}";
        return $this->send($phone, $message);
    }

    /**
     * Send session reminder
     */
    public function sendSessionReminder(string $phone, string $studentName, string $sessionTitle, string $date, string $time): bool
    {
        $message = "تذكير بالجلسة: {$sessionTitle} - التاريخ: {$date} - الوقت: {$time}";
        return $this->send($phone, $message);
    }

    /**
     * Send exam result notification
     */
    public function sendExamResult(string $phone, string $studentName, string $examTitle, float $score, bool $passed): bool
    {
        $status = $passed ? 'ناجح' : 'راسب';
        $message = "نتيجة امتحان {$examTitle}: الطالب {$studentName} - الدرجة: {$score}% - الحالة: {$status}";
        return $this->send($phone, $message);
    }

    /**
     * Send via Twilio
     */
    protected function sendViaTwilio(string $phone, string $message): bool
    {
        try {
            $response = Http::withBasicAuth($this->apiKey, $this->apiSecret)
                ->post('https://api.twilio.com/2010-04-01/Accounts/' . $this->apiKey . '/Messages.json', [
                    'From' => $this->senderId,
                    'To' => $phone,
                    'Body' => $message,
                ]);

            if ($response->successful()) {
                Log::info("SMS sent via Twilio to {$phone}");
                return true;
            }

            Log::error("Twilio SMS failed: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("Twilio SMS exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send via Vonage (Nexmo)
     */
    protected function sendViaVonage(string $phone, string $message): bool
    {
        try {
            $response = Http::post('https://rest.nexmo.com/sms/json', [
                'api_key' => $this->apiKey,
                'api_secret' => $this->apiSecret,
                'from' => $this->senderId,
                'to' => $phone,
                'text' => $message,
                'type' => 'unicode',
            ]);

            $data = $response->json();
            if (isset($data['messages'][0]['status']) && $data['messages'][0]['status'] === '0') {
                Log::info("SMS sent via Vonage to {$phone}");
                return true;
            }

            Log::error("Vonage SMS failed: " . json_encode($data));
            return false;
        } catch (\Exception $e) {
            Log::error("Vonage SMS exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send via Gateway.sa (Saudi/Egypt provider)
     */
    protected function sendViaGatewaySa(string $phone, string $message): bool
    {
        try {
            $response = Http::get('https://www.gateway.sa/api/v1/send', [
                'api_key' => $this->apiKey,
                'sender' => $this->senderId,
                'numbers' => $phone,
                'message' => $message,
            ]);

            if ($response->successful() && str_contains($response->body(), 'success')) {
                Log::info("SMS sent via Gateway.sa to {$phone}");
                return true;
            }

            Log::error("Gateway.sa SMS failed: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("Gateway.sa SMS exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Log SMS (for testing/development)
     */
    protected function sendViaLog(string $phone, string $message): bool
    {
        Log::channel('sms')->info("SMS to {$phone}: {$message}");
        return true;
    }

    /**
     * Normalize phone number
     */
    protected function normalizePhone(string $phone): string
    {
        // Remove all non-digit characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // Handle Egyptian numbers
        if (str_starts_with($phone, '0')) {
            $phone = '2' . $phone; // Add Egypt country code
        }

        // Add + if not present
        if (!str_starts_with($phone, '+')) {
            $phone = '+' . $phone;
        }

        return $phone;
    }

    /**
     * Validate phone number
     */
    protected function isValidPhone(string $phone): bool
    {
        // Basic validation: should be at least 10 digits
        $digits = preg_replace('/[^0-9]/', '', $phone);
        return strlen($digits) >= 10 && strlen($digits) <= 15;
    }
}
