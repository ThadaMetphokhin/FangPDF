<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Mpdf\Mpdf;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class OverviewList extends Controller
{
    //
    public function CalculatorDiskFreeSpace()
    {
        // ระบุ Path ของโฟลเดอร์ที่เก็บไฟล์
        $path = storage_path('app/public/PDF'); // ปรับ Path ตามที่คุณใช้งานจริง

        $totalSize = 0;
        if (File::exists($path)) {
            // คำนวณขนาดไฟล์ทั้งหมดในโฟลเดอร์ (หน่วยเป็น Bytes)
            foreach (File::allFiles($path) as $file) {
                $totalSize += $file->getSize();
            }
        }

        // แปลงหน่วย Bytes เป็น GB (1024^3)
        // หรือถ้าอยากได้หน่วย MB ก่อนค่อยหารก็ได้
        $totalSizeGB = $totalSize / (1024 * 1024 * 1024);

        // ส่งข้อมูลไปที่ React ผ่าน Inertia
        return  [
            'storage' => [
                'usedGB' => round($totalSizeGB, 2), // ปัดเศษ 2 ตำแหน่ง
                'maxGB' => 100, // ขีดจำกัดที่คุณตั้งไว้
            ]
        ];
    }
    public function StatsOverview()
    {
        $Allfiles = DB::select("
            SELECT COUNT(*) as value FROM upload_file_pdf
        ");
        $HistoryDownload = DB::select("
            SELECT COUNT(*) as value FROM history_download_file
        ");
        $AllUsers = DB::select("
            SELECT COUNT(*) as value FROM users WHERE role = 'teacher'
        ");
        return [
            'allFiles' => $Allfiles,
            'historyDownload' => $HistoryDownload,
            'allUsers' => $AllUsers
        ];
    }
    public function ListOverview()
    {
        $teacher = DB::select("
            SELECT 
                COUNT(*) as teacher 
            FROM users 
            WHERE role='teacher' GROUP BY role
        ");
        $history = DB::select("
            SELECT 
                name_file,COUNT(DISTINCT who_download) as count_download 
            FROM history_download_file 
            GROUP BY name_file
        ");
        return [
            'teacherDownload' => $teacher,
            'historyDownload' => $history
        ];
    }

    public function ListLastDownload()
    {
        $LastLoad = DB::select("
            SELECT * FROM history_download_file 
        ");

        return ['lastLoad' => $LastLoad];
    }

    public function generateReport()
    {
        $now = Carbon::now();

        $cate = ['ข้อมูลผู้เรียน', 'ข้อมูลบุคลากร', 'ข้อมูลงบประมาณและทรัพยากร', 'ข้อมูลแผนงาน / ผลดำเนินการ'];

        //Users of Teacher role
        $teacherall = DB::table('users')
            ->where('role', 'teacher')
            ->count();

        // ด้านที่ 1 — ไฟล์เอกสาร
        $section1 = DB::table('upload_file_pdf')
            ->leftJoin(
                'history_download_file',
                'upload_file_pdf.name_file',
                '=',
                'history_download_file.name_file'
            )
            ->select(
                'upload_file_pdf.name_file',
                'upload_file_pdf.category_file',
                DB::raw('COUNT(DISTINCT history_download_file.who_download) as download_count'),
            )
            ->where('upload_file_pdf.category_file', $cate[0])
            ->groupBy('upload_file_pdf.name_file', 'upload_file_pdf.category_file')
            ->get();


        // คำนวณ % แต่ละไฟล์
        $section1 = $section1->map(function ($row) use ($teacherall) {
            $row->total_teacher = $teacherall;
            $row->percent = $teacherall > 0
                ? round($row->download_count / $teacherall * 100, 2)
                : 0;
            return $row;
        });
        //dd($section1); //debug data from database


        // ด้านที่ 2 — บุคลากร
        $section2 = DB::table('upload_file_pdf')
            ->leftJoin(
                'history_download_file',
                'upload_file_pdf.name_file',
                '=',
                'history_download_file.name_file'
            )
            ->select(
                'upload_file_pdf.name_file',
                'upload_file_pdf.category_file',
                DB::raw('COUNT(DISTINCT history_download_file.who_download) as download_count'),
            )
            ->where('upload_file_pdf.category_file', $cate[1])
            ->groupBy('upload_file_pdf.name_file', 'upload_file_pdf.category_file')
            ->get();


        // คำนวณ % แต่ละไฟล์
        $section2 = $section2->map(function ($row) use ($teacherall) {
            $row->total_teacher = $teacherall;
            $row->percent = $teacherall > 0
                ? round($row->download_count / $teacherall * 100, 2)
                : 0;
            return $row;
        });

        // ด้านที่ 3 — งบประมาณ (ปรับตาม table จริง)
        $section3 = DB::table('upload_file_pdf')
            ->leftJoin(
                'history_download_file',
                'upload_file_pdf.name_file',
                '=',
                'history_download_file.name_file'
            )
            ->select(
                'upload_file_pdf.name_file',
                'upload_file_pdf.category_file',
                DB::raw('COUNT(DISTINCT history_download_file.who_download) as download_count'),
            )
            ->where('upload_file_pdf.category_file', $cate[2])
            ->groupBy('upload_file_pdf.name_file', 'upload_file_pdf.category_file')
            ->get();


        // คำนวณ % แต่ละไฟล์
        $section3 = $section3->map(function ($row) use ($teacherall) {
            $row->total_teacher = $teacherall;
            $row->percent = $teacherall > 0
                ? round($row->download_count / $teacherall * 100, 2)
                : 0;
            return $row;
        });

        // ด้านที่ 4 — ผลการดำเนินการ
        $section4 = DB::table('upload_file_pdf')
            ->leftJoin(
                'history_download_file',
                'upload_file_pdf.name_file',
                '=',
                'history_download_file.name_file'
            )
            ->select(
                'upload_file_pdf.name_file',
                'upload_file_pdf.category_file',
                DB::raw('COUNT(DISTINCT history_download_file.who_download) as download_count'),
            )
            ->where('upload_file_pdf.category_file', $cate[3])
            ->groupBy('upload_file_pdf.name_file', 'upload_file_pdf.category_file')
            ->get();


        // คำนวณ % แต่ละไฟล์
        $section4 = $section4->map(function ($row) use ($teacherall) {
            $row->total_teacher = $teacherall;
            $row->percent = $teacherall > 0
                ? round($row->download_count / $teacherall * 100, 2)
                : 0;
            return $row;
        });




        // --- แปลง Logo เป็น Base64 ---
        $logoPath   = public_path('images/logoFang.png');
        $logoBase64 = base64_encode(file_get_contents($logoPath));
        $logoMime   = mime_content_type($logoPath);

        $html =  view('pdf.reportpdf', [
            'section1' => $section1,
            'section2' => $section2,
            'section3' => $section3,
            'section4' => $section4,
            'logoBase64'  => $logoBase64,
            'logoMime'    => $logoMime,
        ])->render();
        // เพิ่ม limit ก่อน
        ini_set('pcre.backtrack_limit', '10000000');
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'orientation' => 'P',
            'tempDir'     => storage_path('app/mpdf'), // ✅ เพิ่ม
            // บอก mPDF ให้โหลด font เองเลย ไม่ต้องใช้ base64
            'fontDir'     => [public_path('fonts')],
            'fontdata'    => [
                'thsarabunpsk' => [
                    'R' => 'THSarabun.ttf',
                    'B' => 'THSarabun-Bold.ttf',
                ],
            ],
            'default_font' => 'thsarabunpsk',
        ]);
        // เพิ่มคำสั่งเปิดหน้าต่าง Print Preview ทันทีที่โหลด PDF
        //$mpdf->SetJS('this.print();');
        // ใช้แค่บรรทัดเดียว
        $mpdf->WriteHTML($html);
        return $mpdf->Output('สรุป-' . $now->toDateString() . '.pdf', 'I');
        // return response($mpdf->Output('สรุป-' . $now->toDateString() . '.pdf', 'I'), 200, [
        //     'Content-Type'        => 'application/pdf',
        //     'Content-Disposition' => 'attachment; filename="สรุป-' . $now->toDateString() . '.pdf"',
        // ]);
    }
    public function OverviewInfomation()
    {
        //Stats
        $Stats = $this->StatsOverview();

        //ListOverview
        $Overview = $this->ListOverview();

        //History Last Download File PDF
        $Last = $this->ListLastDownload();

        //Cal Disk
        $Disk = $this->CalculatorDiskFreeSpace();

        return Inertia::render('Admin/Dashboard', [
            'Stats' => $Stats,
            'Overview' => $Overview,
            'History' => $Last,
            'Disk' => $Disk
        ]);
    }
}
