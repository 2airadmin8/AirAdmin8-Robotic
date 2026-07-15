<?php
/**
 * AirAdmin8 Robotics 問い合わせ送信処理
 *
 * WADAXのSMTP（SSL / 465 / SMTP-Auth）を利用して、
 * 社内通知メールとお客様向け自動返信メールを送信します。
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/**
 * JSONレスポンスを返して処理を終了します。
 */
function respond(int $statusCode, bool $ok, string $message): never
{
    http_response_code($statusCode);
    echo json_encode(
        ['ok' => $ok, 'message' => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'POSTメソッドで送信してください。');
}

$configPath = __DIR__ . '/contact-config.php';
if (!is_file($configPath)) {
    respond(503, false, 'メール送信設定が完了していません。管理者へご連絡ください。');
}

/** @var array<string, mixed> $config */
$config = require $configPath;

$requiredConfigKeys = [
    'smtp_host',
    'smtp_port',
    'smtp_username',
    'smtp_password',
    'from_email',
    'from_name',
    'to_email',
    'reply_subject',
];

foreach ($requiredConfigKeys as $key) {
    if (!isset($config[$key]) || trim((string) $config[$key]) === '') {
        respond(503, false, 'メール送信設定に不足があります。');
    }
}

/**
 * 入力値を安全な文字列として取得します。
 */
function postString(string $key, int $maxLength = 4000): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }

    $value = trim(str_replace(["\r\n", "\r"], "\n", $value));
    return mb_substr($value, 0, $maxLength, 'UTF-8');
}

$organization = postString('organization', 200);
$department = postString('department', 200);
$name = postString('name', 120);
$email = postString('email', 254);
$phone = postString('phone', 80);
$inquiryType = postString('inquiry_type', 120);
$budget = postString('budget', 120);
$preferredTiming = postString('preferred_timing', 120);
$researchTopic = postString('research_topic', 500);
$desiredTask = postString('desired_task', 2000);
$message = postString('message', 4000);
$privacyAgreement = postString('privacy_agreement', 10);
$honeypot = postString('website', 200);

// Bot対策：非表示項目に入力がある場合は、正常応答を返して破棄します。
if ($honeypot !== '') {
    respond(200, true, 'お問い合わせを受け付けました。');
}

if (
    $organization === ''
    || $name === ''
    || $email === ''
    || $researchTopic === ''
    || $message === ''
    || $privacyAgreement !== '1'
) {
    respond(422, false, '必須項目を確認してください。');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'メールアドレスの形式を確認してください。');
}

// 改行を含むメールアドレスはヘッダーインジェクション防止のため拒否します。
if (preg_match('/[\r\n]/', $email)) {
    respond(422, false, 'メールアドレスの形式を確認してください。');
}

/**
 * SMTPサーバーから1つの応答を読み取ります。
 */
function readSmtpResponse($socket): string
{
    $response = '';

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (strlen($line) < 4 || $line[3] === ' ') {
            break;
        }
    }

    return $response;
}

/**
 * SMTPコマンドを送信し、期待するステータスコードを確認します。
 */
function smtpCommand($socket, string $command, array $expectedCodes): string
{
    if ($command !== '') {
        fwrite($socket, $command . "\r\n");
    }

    $response = readSmtpResponse($socket);
    $statusCode = (int) substr($response, 0, 3);

    if (!in_array($statusCode, $expectedCodes, true)) {
        throw new RuntimeException('SMTP command failed: ' . trim($response));
    }

    return $response;
}

/**
 * WADAX SMTPへメールを送信します。
 */
function sendSmtpMail(array $config, string $recipient, string $subject, string $body, string $replyTo): void
{
    $host = (string) $config['smtp_host'];
    $port = (int) $config['smtp_port'];
    $username = (string) $config['smtp_username'];
    $password = (string) $config['smtp_password'];
    $fromEmail = (string) $config['from_email'];
    $fromName = (string) $config['from_name'];

    $remote = sprintf('ssl://%s:%d', $host, $port);
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false,
        ],
    ]);

    $socket = @stream_socket_client(
        $remote,
        $errorNumber,
        $errorMessage,
        20,
        STREAM_CLIENT_CONNECT,
        $context
    );

    if (!is_resource($socket)) {
        throw new RuntimeException(
            sprintf('SMTP connection failed: %s (%d)', $errorMessage, $errorNumber)
        );
    }

    stream_set_timeout($socket, 20);

    try {
        smtpCommand($socket, '', [220]);
        smtpCommand($socket, 'EHLO robotics.air-admin8.co.jp', [250]);
        smtpCommand($socket, 'AUTH LOGIN', [334]);
        smtpCommand($socket, base64_encode($username), [334]);
        smtpCommand($socket, base64_encode($password), [235]);
        smtpCommand($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
        smtpCommand($socket, 'RCPT TO:<' . $recipient . '>', [250, 251]);
        smtpCommand($socket, 'DATA', [354]);

        $encodedSubject = mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
        $encodedFromName = mb_encode_mimeheader($fromName, 'UTF-8', 'B', "\r\n");
        $messageId = sprintf('<%s@robotics.air-admin8.co.jp>', bin2hex(random_bytes(12)));

        $headers = [
            'Date: ' . date(DATE_RFC2822),
            'Message-ID: ' . $messageId,
            'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
            'To: <' . $recipient . '>',
            'Reply-To: <' . $replyTo . '>',
            'Subject: ' . $encodedSubject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];

        $normalizedBody = str_replace(["\r\n", "\r"], "\n", $body);
        $normalizedBody = str_replace("\n.", "\n..", $normalizedBody);
        $payload = implode("\r\n", $headers)
            . "\r\n\r\n"
            . str_replace("\n", "\r\n", $normalizedBody)
            . "\r\n.";

        smtpCommand($socket, $payload, [250]);
        smtpCommand($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

$submittedAt = date('Y-m-d H:i:s T');
$userAgent = mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500, 'UTF-8');
$remoteAddress = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');

$internalSubject = sprintf(
    '【AirAdmin8 Robotics】新規お問い合わせ：%s / %s',
    $organization,
    $name
);

$internalBody = <<<TEXT
AirAdmin8 Roboticsの問い合わせフォームから新しいご相談が届きました。

■ 大学名 / 会社名
{$organization}

■ 研究室名 / 部署名
{$department}

■ お名前
{$name}

■ メールアドレス
{$email}

■ 電話番号
{$phone}

■ 相談区分
{$inquiryType}

■ 予算感
{$budget}

■ 導入希望時期
{$preferredTiming}

■ 研究テーマ / 解決したい課題
{$researchTopic}

■ ロボットに任せたい仕事 / 人に戻したい時間
{$desiredTask}

■ 相談内容
{$message}

---
送信日時：{$submittedAt}
送信元IP：{$remoteAddress}
User-Agent：{$userAgent}
TEXT;

$replySubject = (string) $config['reply_subject'];
$replyBody = <<<TEXT
{$name} 様

AirAdmin8 Roboticsへお問い合わせいただき、ありがとうございます。
以下の内容で受け付けました。
担当者が内容を確認し、通常1〜2営業日以内にご連絡します。

■ 大学名 / 会社名
{$organization}

■ 相談区分
{$inquiryType}

■ 研究テーマ / 解決したい課題
{$researchTopic}

■ 相談内容
{$message}

※本メールは自動送信です。
※お心当たりがない場合は、このメールを破棄してください。

株式会社AirAdmin8
AirAdmin8 Robotics
airobot@robotics.air-admin8.co.jp
https://robotics.air-admin8.co.jp/
TEXT;

try {
    // 社内通知メール
    sendSmtpMail(
        $config,
        (string) $config['to_email'],
        $internalSubject,
        $internalBody,
        $email
    );

    // お客様向け自動返信メール
    sendSmtpMail(
        $config,
        $email,
        $replySubject,
        $replyBody,
        (string) $config['from_email']
    );
} catch (Throwable $error) {
    error_log('[AirAdmin8 Contact] ' . $error->getMessage());
    respond(500, false, 'メール送信に失敗しました。時間をおいて再度お試しください。');
}

respond(200, true, 'お問い合わせを受け付けました。');
