<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;
use \Exception;
use Inertia\Inertia;

class UsersInfomation extends Controller
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

        //  แปลงหน่วย Bytes เป็น GB (1024^3)
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
    public function ListAllUsers()
    {
        try {
            DB::connection()->getPdo();
            $ListUsers = DB::select("
            SELECT * FROM users ORDER BY name DESC
        ");

            $Count = DB::select("
            SELECT COUNT(*) as count_users FROM users
        ");

            return ['listUsers' => $ListUsers, 'countUsers' => $Count];
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }
    public function AddNewUsers(Request $req)
    {
        try {
            DB::connection()->getPdo();
            $req->validate([
                'username' => 'required|string',
                'password' => 'required|string',
                'name' => 'required|string',
                'role' => 'required|string'
            ]);

            DB::table('users')->insert(['username' => $req->username, 'password' => $req->password, 'name' => $req->name, 'role' => $req->role]);
            return back()->with('success', 'เพิ่มผู้ใช้งาน ' . $req->username . ' ใหม่สำเร็จ!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    public function UpdateUsers(Request $req)
    {
        try {
            DB::connection()->getPdo();
            $req->validate([
                'id' => 'required',
                'username' => 'required|string',
                'password' => 'required|string',
                'name' => 'required|string',
                'role' => 'required|string'
            ]);

            $data = [
                'username' => $req->username,
                'password' => $req->password,
                'name' => $req->name,
                'role' => $req->role
            ];

            DB::table('users')->where('id', $req->id)->update($data);
            return back()->with('success', 'อัพเดตข้อมูลผู้ใช้งานใหม่ ' . $req->username . ' สำเร็จ!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    public function DeleteUsers(Request $req)
    {
       
        try {
            DB::connection()->getPdo();
            $req->validate([
                'id' => "required",
                'username' => 'required|string',
                'name' => 'required|string'
            ]);
            DB::table('users')->where('id', $req->id)->delete();

            return back()->with('success', 'ลบข้อมูลผู้ใช้งาน ' . $req->username . ' ' . $req->name . ' สำเร็จ!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'เกิดข้อผิดพลาด ' . $e->getMessage()]);
        }
    }
    public function UsersInformation()
    {
        $ListUsers = $this->ListAllUsers();
        $Disk = $this->CalculatorDiskFreeSpace();
        return Inertia::render("Admin/User/ManageUser", [
            'ListUsers' => $ListUsers,
            'Disk'=>$Disk
        ]);
    }
}
