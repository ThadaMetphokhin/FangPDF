<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use \Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use \Exception;
use Inertia\Inertia;

class UploadsFilePDF extends Controller
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

        // 2. แปลงหน่วย Bytes เป็น GB (1024^3)
        // หรือถ้าอยากได้หน่วย MB ก่อนค่อยหารก็ได้
        $totalSizeGB = $totalSize / (1024 * 1024 * 1024);

        // 3. ส่งข้อมูลไปที่ React ผ่าน Inertia
        return  [
            'storage' => [
                'usedGB' => round($totalSizeGB, 2), // ปัดเศษ 2 ตำแหน่ง
                'maxGB' => 100, // ขีดจำกัดที่คุณตั้งไว้
            ]
        ];
    }
    public function ListAllFilesPDF()
    {
        try {
            DB::connection()->getPdo();
            $ListFiles = DB::select("
            SELECT * FROM upload_file_pdf
        ");

            $Category = DB::select("
            SELECT * FROM category_file
        ");

            return ['listFiles' => $ListFiles, 'categoryFile' => $Category];
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    public function UploadFilesPDF(Request $req)
    {


        // dd([
        //     'upload_max_filesize' => ini_get('upload_max_filesize'),
        //     'post_max_size' => ini_get('post_max_size'),
        //     'file_received' => $req->hasFile('file_PDF'),
        //     'all_files' => $req->allFiles(),
        //     'content_length' => $req->header('Content-Length'),
        // ]);


        $now = Carbon::now();
        $user = Auth::user(); // ดึงข้อมูลคน Login

        try {
            DB::connection()->getPdo();
            //Validation Fils PDF
            $req->validate([
                'default_name' => 'required|string|max:255',
                'name_file' => 'required|string|max:255',
                'category_file' => 'required|string|max:255',
                'comment_file' => 'required|string|max:255',
                'count_page' => 'required',
                'size_file' => 'required',
                //'file_PDF' => 'required|mimes:pdf|max:104857600'
                'file_chunk' => 'required',
                'upload_id' => 'required',
                'chunk_index' => 'required|numeric',
                'total_chunks' => 'required|numeric'
            ], [
                'name_file.required' => 'กรุณากรอกชื่อไฟล์',
                'name_file.max' => 'ความยาวชื่อต้องไม่เกิน 255 ตัวอักษร',
                'category_file.required' => 'กรุณาเลือกหมวดหมู่ไฟล์',
                'comment_file.required' => 'กรุณาใส่คอมเมนต์ไฟล์',
            ]);

            $uploadId = $req->upload_id;
            $index = $req->chunk_index;
            $total = (int) $req->total_chunks;
            $fileChunk = $req->file('file_chunk'); // รับไฟล์ชิ้นส่วน

            //กำหนด Path สำหรับเก็บชิ้นส่วนชั่วคราว (Storage/app/chunks/{uploadId}) ระบุโฟลเดอร์เก็บชิ้นส่วนชั่วคราว
            $tempDir = storage_path("app/chunks/{$uploadId}");

            if (!File::exists($tempDir)) {
                File::makeDirectory($tempDir, 0777, true);
            }

            // บันทึกชิ้นส่วนไฟล์ลงไป
            $fileChunk->move($tempDir, "part_{$index}");

            // ตรวจสอบว่าได้รับครบทุกชิ้นหรือยัง
            $uploadFiles = count(File::files($tempDir));

            if ($uploadFiles === $total) {
                // --- เริ่มกระบวนการรวมไฟล์ (Merge) ---
                $finalFileName = time() . '_' . $req->name_file . '.pdf';
                $relativePath = "PDF/{$finalFileName}"; // path สำหรับเก็บใน DB
                $finalPath = storage_path("app/public/" . $relativePath);

                // ตรวจสอบโฟลเดอร์ปลายทาง
                if (!File::exists(storage_path("app/public/PDF"))) {
                    File::makeDirectory(storage_path("app/public/PDF"), 0777, true);
                }

                $out = fopen($finalPath, "ab");
                for ($i = 0; $i < $total; $i++) {
                    $chunkFile = "{$tempDir}/part_{$i}";
                    $in = fopen($chunkFile, "rb");
                    while ($line = fread($in, 4096)) {
                        fwrite($out, $line);
                    }
                    fclose($in);
                }
                fclose($out);

                // ลบโฟลเดอร์ชั่วคราวทิ้ง
                File::deleteDirectory($tempDir);


                DB::table('upload_file_pdf')->insert([
                    'name_file' => $req->name_file,
                    'default_name' => $req->default_name,
                    'category_file' => $req->category_file,
                    'comment_file' => $req->comment_file,
                    'who_upload' => $user->name,
                    'upload_date' => $now->toDateString(),
                    'upload_time' => $now->toTimeString(),
                    'count_pages' => $req->count_page,
                    'location_file' => $relativePath,
                    'size_file' => $req->size_file,
                    // 'created_at' => $now, 
                    // 'updated_at' => $now
                ]);

                $allChunkDir = File::directories(storage_path('app/chunks'));
                foreach ($allChunkDir as $dir) {
                    if (time() - File::lastModified($dir) > 86400) {
                        File::deleteDirectory($dir);
                    }
                }
                //return back()->with('success', 'อัปโหลดไฟล์โดย ' . $user->name . ' สำเร็จ!');

                return response()->json([
                    'status' => 'completed',
                    'message' => 'อัปโหลดไฟล์สำเร็จ!'
                ]);
            }
            return response()->json([
                'status' => 'processing',
                'message' => "Chunk $index saved",
                'debug' => [
                    'current_count' => $uploadFiles,
                    'target_total' => $total,
                    'upload_id' => $uploadId
                ]
            ]);
            // if ($req->hasFile('file_PDF')) {
            //     //Path of Folder save files PDF to storage/app/public/PDF
            //     $path = $req->file('file_PDF')->store('PDF', 'public');

            //     DB::table('upload_file_pdf')->insert([
            //         'name_file' => $req->name_file,
            //         'default_name' => $req->default_name,
            //         'category_file' => $req->category_file,
            //         'comment_file' => $req->comment_file,
            //         'who_upload' => $user->name,
            //         'upload_date' => $now->toDateString(),
            //         'upload_time' => $now->toTimeString(),
            //         'count_pages' => $req->count_page,
            //         'location_file' => $path,
            //         'size_file' => $req->size_file,
            //         // 'created_at' => $now, // ใส่เพิ่มเพื่อให้ดู Log ย้อนหลังได้ง่าย
            //         // 'updated_at' => $now
            //     ]);
            //     return back()->with('success', 'อัปโหลดไฟล์โดย ' . $user->name . ' สำเร็จ!');
            // }
        } catch (ValidationException $e) {
            // ส่ง Error Validation กลับไปเป็น JSON
            // return response()->json([
            //     'status' => 'error',
            //     'errors' => $e->errors()
            // ], 422);
            //return response()->json(['errors' => $e->errors()], 422);
            //return back()->withErrors($e->errors())->withInput();
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors()
            ], 422);
            //return back()->with('message', 'ไฟล์มีขนาดใหญ่เกิน 10 MB')->withErrors($e->errors())->withInput();
        } catch (Exception $e) {
            // ส่ง Error ทั่วไปกลับไป
            // return response()->json([
            //     'status' => 'error',
            //     'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
            // ], 500);
            //return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
            ], 500);
        }
    }

    public function UploadUpdateInfor(Request $req)
    {
        try {
            $req->validate([
                'id' => 'required',
                'name_file' => 'required|string',
                'category' => 'required|string',
                'comment' => 'required|string'
            ]);

            $data = [
                'name_file' => $req->name_file,
                'category_file' => $req->category,
                'comment_file' => $req->comment
            ];

            DB::table('upload_file_pdf')->where('id', $req->id)->update($data);

            return back()->with('success', 'อัพเดตข้อมูลของ ' . $req->name_file . ' สำเร็จ!');
            // return response()->json([
            //     'status' => 'success',
            //     'message' => 'อัพเดตข้อมูลของ ' . $req->name_file . ' สำเร็จ!'
            // ], 200);
        } catch (ValidationException $e) {
            // ถ้า Validation ไม่ผ่าน ให้กลับไปพร้อม Error
            return back()->withErrors($e->errors())->withInput();
        } catch (Exception $e) {
            // ถ้าเกิด Error อื่นๆ (เช่น DB ล่ม หรือ Disk เต็ม)
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    public function DeleteFilesPDF(Request $req)
    {
        try {
            DB::connection()->getPdo();
            $req->validate([
                'id' => 'required',
                'name_file' => 'required|string'
            ]);
            $path_file = DB::table('upload_file_pdf')->where('id', $req->id)->first();
            if (!$path_file) {
                return back()->withErrors(['message' => 'ไม่พบไฟล์ที่ต้องการลบ']);
            }

            //ลบไฟล์
            if ($path_file->location_file && Storage::disk('public')->exists($path_file->location_file)) {
                Storage::disk('public')->delete($path_file->location_file);
            }

            DB::table('upload_file_pdf')->where('id', $req->id)->delete();
            return back()->with('success', 'ลบไฟล์ ' . $req->name_file . ' สำเร็จ!');
        } catch (ValidationException $e) {
            // ถ้า Validation ไม่ผ่าน ให้กลับไปพร้อม Error
            return back()->withErrors($e->errors())->withInput();
        } catch (Exception $e) {
            // ถ้าเกิด Error อื่นๆ (เช่น DB ล่ม หรือ Disk เต็ม)
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    public function UploadFilePDFInfomation()
    {
        $ListFiless = $this->ListAllFilesPDF();
        $Disk = $this->CalculatorDiskFreeSpace();

        return Inertia::render("Admin/Uploads/UploadFile", [
            'ListFiles' => $ListFiless,
            'Disk' => $Disk
        ]);
    }
}
