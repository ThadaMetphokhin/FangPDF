<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class HistoryDownload extends Controller
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
    public function History(){
        $History = DB::select("
                SELECT * FROM history_download_file
        ");
        $Count = DB::select("
                SELECT COUNT(*) as count_history FROM history_download_file
        ");
        return ['historyDownload'=>$History,'countDown'=>$Count];
    }

    public function HistoryDownloadInformation(){
        $His = $this->History();
        $Disk = $this->CalculatorDiskFreeSpace();

        return Inertia::render("Admin/History/HistoryDownload",[
            'historyDownload'=>$His,
            'Disk'=>$Disk
        ]);
    }
}
