<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <title>สรุปการรายงาน</title>
    @include('pdf._style')
</head>

<body>

    {{-- Header --}}
    <div class="header">
        <img src="data:{{ $logoMime }};base64,{{ $logoBase64 }}" alt="logo">
        <h1>รายงานการใช้ระบบข้อมูลสารสนเทศ วิทยาลัยการอาชีพฝาง</h1>
    </div>

    {{-- ด้านที่ 1 --}}
    <div class="section">
        <table>
            <tr>
                <td class="section-title">ด้านที่ 1 ข้อมูลผู้เรียน</td>
            </tr>
        </table>
        <table>
            <colgroup>
                <col style="width: 60%;">
                <col style="width: 40%;">
            </colgroup>
            <thead>
                <tr>
                    <th style="width: 60%;">ไฟล์เอกสาร</th>
                    <th style="width: 40%;">คิดเป็นร้อยละ</th>
                </tr>
            </thead>
            <tbody>
                @forelse($section1 as $row)
                @if($loop->first)
                <tr>
                    <td class="namefile">{{ $loop->iteration }}. {{ $row->name_file }}</td>
                    <td style="text-align:center; vertical-align:middle;"
                        rowspan="{{ $section1->count() }}">

                        @include('pdf.components.GraphCiecle', [
                        'percent' => $row->percent,
                        'total' => $row->total_teacher,
                        'downloaded' => $row->download_count,
                        ])


                    </td>
                </tr>
                @else
                <tr>
                    <td class="namefile">{{ $loop->iteration }}. {{ $row->name_file }}</td>
                </tr>
                @endif
                @empty
                <tr class="empty-row">
                    <td></td>
                    <td></td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
<div class="page-break"></div>
    {{-- ด้านที่ 2 --}}
    <div class="section">
        <table>
            <tr>
                <td class="section-title">ด้านที่ 2 ข้อมูลบุคลากร</td>
            </tr>
        </table>
        <table>
            <colgroup>
                <col style="width: 60%;">
                <col style="width: 40%;">
            </colgroup>
            <thead>
                <tr>
                    <th style="width: 60%;">ไฟล์เอกสาร</th>
                    <th style="width: 40%;">คิดเป็นร้อยละ</th>
                </tr>
            </thead>
            <tbody>
                @forelse($section2 as $row)
                @if($loop->first)
                <tr>
                    <td class="namefile">{{ $loop->iteration }}. {{ $row->name_file }}</td>
                    <td style="text-align:center; vertical-align:middle;"
                        rowspan="{{ $section2->count() }}">

                        @include('pdf.components.GraphCiecle', [
                        'percent' => $row->percent,
                        'total' => $row->total_teacher,
                        'downloaded' => $row->download_count,
                        ])


                    </td>
                </tr>
                @else
                <tr>
                    <td class="namefile">{{ $loop->iteration }}. {{ $row->name_file }}</td>
                </tr>
                @endif
                @empty
                <tr class="empty-row">
                    <td></td>
                    <td></td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
<div class="page-break"></div>
    {{-- ด้านที่ 3 --}}
    <div class="section">
        <table>
            <tr>
                <td class="section-title">ด้านที่ 3 ข้อมูลงบประมาณและทรัพยากร</td>
            </tr>
        </table>
        <table>
            <colgroup>
                <col style="width: 60%;">
                <col style="width: 40%;">
            </colgroup>
            <thead>
                <tr>
                    <th style="width: 60%;">ไฟล์เอกสาร</th>
                    <th style="width: 40%;">คิดเป็นร้อยละ</th>
                </tr>
            </thead>
            <tbody>
                @forelse($section3 as $row)
                @if($loop->first)
                <tr>
                    <td class="namefile">{{ $loop->iteration }}. {{ $row->name_file }}</td>
                    <td style="text-align:center; vertical-align:middle;"
                        rowspan="{{ $section3->count() }}">

                        @include('pdf.components.GraphCiecle', [
                        'percent' => $row->percent,
                        'total' => $row->total_teacher,
                        'downloaded' => $row->download_count,
                        ])


                    </td>
                </tr>
                @else
                <tr>
                    <td class="namefile">{{ $loop->iteration }}. {{ $row->name_file }}</td>
                </tr>
                @endif
                @empty
                <tr class="empty-row">
                    <td></td>
                    <td></td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
<div class="page-break"></div>
    {{-- ด้านที่ 4 --}}
    <div class="section">
        <table>
            <tr>
                <td class="section-title">ด้านที่ 4 ข้อมูลแผนงาน / ผลการดำเนินการ</td>
            </tr>
        </table>
        <table>
            <colgroup>
                <col style="width: 60%;">
                <col style="width: 40%;">
            </colgroup>
            <thead>
                <tr>
                    <th style="width: 60%;">ไฟล์เอกสาร</th>
                    <th style="width: 40%;">คิดเป็นร้อยละ</th>
                </tr>
            </thead>
            <tbody>
                @forelse($section4 as $row)
                @if($loop->first)
                <tr>
                    <td class="namefile">{{ $loop->iteration }}. {{ $row->name_file }}</td>
                    <td style="text-align:center; vertical-align:middle;"
                        rowspan="{{ $section4->count() }}">

                        @include('pdf.components.GraphCiecle', [
                        'percent' => $row->percent,
                        'total' => $row->total_teacher,
                        'downloaded' => $row->download_count,
                        ])


                    </td>
                </tr>
                @else
                <tr>
                    <td class="namefile">{{ $loop->iteration }}. {{ $row->name_file }}</td>
                </tr>
                @endif
                @empty
                <tr class="empty-row">
                    <td></td>
                    <td></td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
<div class="page-break"></div>
    <div class="signature-container">
        <table class="sig-table" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td style="width: 50%; border: none;"></td>
                <td class="sig-cell">
                    <div class="sig-wrapper">
                        <div class="sig-line">ลงชื่อ...........................................................</div>
                        <div class="sig-name">(...........................................................)</div>
                        <div class="sig-title">หัวหน้างานศูนย์ข้อมูลและสารสนเทศ</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="width: 50%; border: none;"></td>
                <td class="sig-cell">
                    <div class="sig-wrapper">
                        <div class="sig-line">ลงชื่อ...........................................................</div>
                        <div class="sig-name">(...........................................................)</div>
                        <div class="sig-title">รองฝ่ายแผนงานและความร่วมมือ</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="width: 50%; border: none;"></td>
                <td class="sig-cell">
                    <div class="sig-wrapper">
                        <div class="sig-line">ลงชื่อ...........................................................</div>
                        <div class="sig-name">(...........................................................)</div>
                        <div class="sig-title">ผู้อำนวยการวิทยาลัยการอาชีพฝาง</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>


</body>

</html>