@php
$cx = 50;
$cy = 50;
$r = 45;
$percent = $percent ?? 0; // กันพัง
$angle = ($percent / 100) * 360;
$rad = deg2rad($angle - 90);
$endX = round($cx + $r * cos($rad), 4);
$endY = round($cy + $r * sin($rad), 4);
$large = $angle > 180 ? 1 : 0;
@endphp

<div style="text-align: center; width: 100px;">
    <svg width="110" height="110" viewBox="-10 -10 110 110" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="{{ $r }}"
            fill="none" stroke="#e5e7eb" stroke-width="10" />

        @if($percent > 0 && $percent
        < 100)
            <path d="M 50 {{ 50 - $r }} A {{ $r }} {{ $r }} 0 {{ $large }} 1 {{ $endX }} {{ $endY }}"
            fill="none" stroke="#FF7F11" stroke-width="10" stroke-linecap="round" />
        @elseif($percent >= 100)
        <circle cx="50" cy="50" r="{{ $r }}"
            fill="none" stroke="#FF7F11" stroke-width="10" />
        @endif

        <text x="50" y="57"
            text-anchor="middle"
            font-family="sarabun"
            font-size="18"
            font-weight="bold"
            fill="#1f2937">{{ $percent }}%</text>
    </svg>
    <br>
    <br>

    <div style=" line-height: 1.6;">
        <p style="margin: 0;">จากครูทั้งหมด: {{ $total }}</p>
        <p style="margin: 0;">การดาวน์โหลดไฟล์: {{ $downloaded }}</p>
    </div>
</div>