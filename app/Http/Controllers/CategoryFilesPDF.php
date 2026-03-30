<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\File;
use \Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategoryFilesPDF extends Controller
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

        //  ส่งข้อมูลไปที่ React ผ่าน Inertia
        return  [
            'storage' => [
                'usedGB' => round($totalSizeGB, 2), // ปัดเศษ 2 ตำแหน่ง
                'maxGB' => 100, // ขีดจำกัดที่คุณตั้งไว้
            ]
        ];
    }
    public function ListCategory()
    {
        $Category = DB::select("
            SELECT * FROM category_file
        ");
        return ['listCategory' => $Category];
    }

    public function AddNewCategory(Request $req)
    {
        try {
            DB::connection()->getPdo();
            $req->validate([
                'name_cate'=>'required|string'
            ],[
                'name_cate.required'=>'กรุณากรอกชื่อหมวดหมู่'
            ]);
            DB::table('category_file')->insert(['name'=>$req->name_cate]);
            return back()->with('success', 'เพิ่มหมวดหมู่ '.$req->name_cate .' ใหม่สำเร็จ!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    public function UpdateCategory(Request $req)
    {
        try {
            DB::connection()->getPdo();
            $req->validate([
                'id' => 'required',
                'name_cate' => 'required|string'
            ]);

            $data = ['name' => $req->name_cate];
            DB::table('category_file')->where('id', $req->id)->update($data);
            return back()->with('success', 'อัพเดตข้อมูลของสำเร็จ!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    public function DeleteCategory(Request $req)
    {
        try {
            DB::connection()->getPdo();
            $req->validate([
                'id' => 'required',
                'name_cate' => 'required|string'
            ]);

            DB::table('category_file')->where('id', $req->id)->delete();
            return back()->with('success', 'ทำการลบหมวดหมู่ ' . $req->name_cate . ' สำเร็จ!');
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    public function CategoryInfomation()
    {
        $Cate = $this->ListCategory();
        $Disk =$this->CalculatorDiskFreeSpace();
        return Inertia::render("Admin/Category/CategoryFiles", [
            'cateFiles' => $Cate,
            'Disk'=>$Disk
        ]);
    }
}
