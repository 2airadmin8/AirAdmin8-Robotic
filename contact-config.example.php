<?php
/**
 * 問い合わせフォーム用SMTP設定テンプレート
 *
 * 本ファイルを contact-config.php にコピーし、SMTPパスワードを設定してください。
 * contact-config.php はGit管理対象外です。公開リポジトリへ登録しないでください。
 */

return [
    'smtp_host' => 'robotics.air-admin8.co.jp',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl',
    'smtp_username' => 'airobot@robotics.air-admin8.co.jp',
    'smtp_password' => 'ここにSMTPパスワードを設定',

    'from_email' => 'airobot@robotics.air-admin8.co.jp',
    'from_name' => 'AirAdmin8 Robotics',
    'to_email' => 'airobot@robotics.air-admin8.co.jp',
    'reply_subject' => '【AirAdmin8 Robotics】お問い合わせを受け付けました',

    'allowed_origin' => 'https://robotics.air-admin8.co.jp',
];
