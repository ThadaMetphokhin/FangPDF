<?php
/**
 * GitHub Webhook Script for Laravel Production (CyberPanel)
 * 
 */


$path = "/public_html"; // แก้เป็น Path จริงของคุณ
$phpPath = "/usr/local/lsws/lsphp82/bin/php"; // Path ของ PHP 8.2 บน CyberPanel


$commands = [
    "cd $path",
    "git fetch --all 2>&1",                     // ดึงข้อมูลล่าสุดจากทุก Branch
    "git checkout origin/prod 2>&1",       // บังคับทับไฟล์ด้วย Branch prod
    "$phpPath artisan optimize:clear 2>&1",    // ล้างแคช Laravel ทั้งหมด
    "chown -R fvepd4375:fvepd4375 $path 2>&1" // คืนสิทธิ์ให้ User เว็บ (แก้ชื่อ User ให้ตรง)fvepd4375@cyber
];

$output = [];
$output[] = "=== Deployment Started: " . date("Y-m-d H:i:s") . " ===";

foreach ($commands as $cmd) {
    exec($cmd, $result);
    $output[] = "> $cmd";
    $output = array_merge($output, $result);
    $result = []; // Clear result for next command
}

$output[] = "=== Deployment Finished ===";

// บันทึกลง Log เพื่อตรวจสอบภายหลัง
file_put_contents("deploy_log.txt", implode("\n", $output));

// ตอบกลับ GitHub
echo "Deployment Finished. Check deploy_log.txt for details.";