<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


use Illuminate\Support\Facades\Auth;


class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // ถ้ายังไม่ได้ล็อกอิน ให้ไปหน้า Login
        if (!Auth::check()) {
            return redirect('/')->with('error', 'กรุณาเข้าสู่ระบบก่อน');
        }

        if (Auth::check()) {
            if (Auth::user()->role === "admin") {
                //return redirect('/Admin');
                return $next($request);
            }
        }

        // ถ้ายังไม่ได้ล็อกอินเลย ให้ส่งไปหน้า Login
        return redirect('/User')->with('error', 'คุณไม่มีสิทธิ์เข้าถึงหน้า Admin');
        // return $next($request);
    }
}
