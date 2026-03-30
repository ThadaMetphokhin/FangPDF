<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Auth;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // กำหนดทิศทางการ Redirect พื้นฐานของ Laravel 11
        $middleware->redirectTo(
            guests: '/',      // ถ้ายังไม่ล็อกอิน ให้ไปที่นี่
            users: function () {
                if (Auth::check()) {
                    return Auth::user()->role === 'admin' ? '/Admin' : '/User';
                }
                return '/User'; // ค่า Default กันพลาด
            },   // ถ้าล็อกอินแล้วพยายามเข้าหน้า Login ให้เด้งไปที่นี่ (เพื่อกันลูป)
        );
        //ลงทะเบียน Middleware: (สำหรับ Laravel 11) 
        $middleware->alias([
            'admin' => \App\Http\Middleware\CheckAdmin::class,
        ]);
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,

        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->registered(function ($app) {
        if ($app->environment('production')) {
            $app->usePublicPath(base_path());
        }
    })
    ->create();
