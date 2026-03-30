<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    //
    public function Login(Request $req)
    {
        try {

            DB::connection()->getPdo();
            //Validate value from client
            $credentials = $req->validate([
                'username' => ['required', 'string'],
                'password' => ['required', 'string']
            ]);
            // ป้องกันการเดาสุ่มรหัสผ่าน (Brute Force Protection)
            // ถ้าพยายามล็อกอินผิดเกิน 5 ครั้งใน 1 นาที จะโดนระงับชั่วคราว
            $throttleKey = Str::lower($req->input('username') . '|' . $req->ip());
            if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
                $seconds = RateLimiter::availableIn($throttleKey);
                throw ValidationException::withMessages([
                    'status' => 'Wait a Queue',
                    'message' => "คุณพยายามเข้าระบบบ่อยเกินไป กรุณารออีก $seconds วินาที"
                ]);
            }

            //สำหรับรหัสผ่านที่ถูก Hash เท่านั้น
            // พยายามเข้าสู่ระบบ (Laravel จะไปเช็คในตาราง users ให้เอง) ทำการตรวจสอบสิทธิ์ (Authentication)
            // หมายเหตุ: Laravel เช็ค password แบบ Hashed (Bcrypt) เป็นมาตรฐาน
            // Laravel ใช้ Prepared Statements ภายในตัว ป้องกัน SQL Injection 100%
            // if(Auth::attempt($credentials,$req->boolean('remember'))){
            //     $req->session()->regenerate(); // ป้องกัน Session Fixation (เปลี่ยน Session ID ใหม่หลังล็อกอิน)

            //     RateLimiter::clear($throttleKey);

            //     return  redirect()->intended('/Dashboard');
            // }

            $user = \App\Models\User::where('username', $credentials['username'])
                ->where('password', $credentials['password']) // เช็คแบบตัวต่อตัวตรงนี้
                ->first();



            if ($user) {
                // ถ้าเจอข้อมูล ให้สั่ง Login เข้าสู่ระบบด้วยตัวแปร $user นั้นเลย
                Auth::login($user, $req->boolean('remember'));

                $req->session()->regenerate();
                RateLimiter::clear($throttleKey);

                //Check Role User
                if ($user->role === "admin") {
                    return redirect()->intended('/Admin');
                }

                return redirect()->intended('/User');
            }
            //  บันทึกประวัติการล็อกอินผิด
            RateLimiter::hit($throttleKey);
            //  ถ้าไม่ผ่าน ส่ง Error กลับไปที่หน้า React
            //401 Unauthorized:
            //return back()->with('message', 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
            throw ValidationException::withMessages(['status' => '401', 'message' => 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง']);
        }catch(ValidationException $e){
            throw $e;
        } catch (Exception $e) {
            //Internal Server Error
            return back()->withErrors(['status'=>'500 ','database' => 'ขออภัย ขณะนี้ระบบฐานข้อมูลขัดข้อง']);
        }
    }

    public function Logout(Request $req)
    {
        Auth::logout();
        $req->session()->invalidate();
        $req->session()->regenerateToken(); // ป้องกัน CSRF หลัง Logout
        return redirect('/');
    }
}
