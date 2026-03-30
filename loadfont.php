<?php
// load_font.php — วางไว้ที่ root โปรเจกต์ รันครั้งเดียวเท่านั้น
require __DIR__ . '/vendor/autoload.php';

$fontDir  = storage_path('fonts');
$pdfDir   = storage_path('fonts');

$dompdf = new Dompdf\Dompdf();
$canvas = $dompdf->getCanvas();
$fontMetrics = new Dompdf\FontMetrics($canvas, new Dompdf\Options());

$fontMetrics->registerFont(
    ['family' => 'Sarabun', 'style' => 'normal', 'weight' => 'normal'],
    $fontDir . '/THSarabun.ttf'
);

$fontMetrics->registerFont(
    ['family' => 'Sarabun', 'style' => 'normal', 'weight' => 'bold'],
    $fontDir . '/Sarabun-Bold.ttf'
);

echo "✅ Font registered!\n";