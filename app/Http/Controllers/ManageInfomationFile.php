<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ManageInfomationFile extends Controller
{
    //

    public function ListFilePDFforDownLoad()
    {
        if (Auth::user()->role === 'admin') {
            return redirect('/Admin');
        }
        // เขียน SQL Raw 
        $document  = DB::select("
            SELECT 
                u.name_file, 
                u.category_file, 
                u.count_pages, 
                u.size_file, 
                u.upload_date, 
                u.upload_time, 
            COUNT(h.name_file) as count_download 
            FROM upload_file_pdf u
            LEFT JOIN history_download_file h ON h.name_file = u.name_file 
            GROUP BY 
                u.name_file, 
                u.category_file, 
                u.count_pages, 
                u.size_file, 
                u.upload_date, 
                u.upload_time
         ");
        //dd($document);

        //$document = DB::table('upload_file_pdf')->get();
        return Inertia::render('User/Dashboard', [
            'ListFiles' => $document
        ]);
    }

    public function RecordDownloadFilePDFs(Request $req)
    {

        $req->validate([
            'name_file' => 'required|string'
        ]);


        //Insert infomation who download
        DB::table('history_download_file')->insert([
            'name_file' => $req->name_file,
            'who_download' => Auth::user()->name ?? "guest",
            'date_download' => now()->format('Y-m-d'),
            'time_download' => now()->format('H:i:s')

        ]);
        return back()->with('success', 'บันทึกประวัติการดาวน์โหลดแล้ว');
        //return response()->json(['message' => "บันทึกประวัติการดาวน์โหลดแล้ว"]);
    }

    public function DownloadFilePDFs(Request $req)
    {
        $req->validate([
            'file_name' => 'required|string'
        ]);

        $file = DB::table('upload_file_pdf')
            ->where('name_file', $req->file_name)
            ->first();

        if (!$file) {
            abort(404, 'ไม่พบไฟล์ที่ต้องการดาวน์โหลด');
        }
        $path = storage_path('app/public/' . $file->location_file);
        if (!file_exists($path)) {
            $path = public_path($file->location_file);
        }

        return response()->download($path, $file->name_file . '.pdf');
    }
}
