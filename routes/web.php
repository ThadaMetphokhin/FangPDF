<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

//AuthController
use App\Http\Controllers\AuthController;

//Query List For download
use App\Http\Controllers\ManageInfomationFile;


//Overview of Admin Dashboard
use App\Http\Controllers\OverviewList;

//Upload of Admin Uploads
use App\Http\Controllers\UploadsFilePDF;

//Category
use App\Http\Controllers\CategoryFilesPDF;

//History
use App\Http\Controllers\HistoryDownload;

//User Manage
use App\Http\Controllers\UsersInfomation;
use League\Uri\Contracts\UserInfoInterface;

Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Auth/Login');
    })->name('login');
    //Login Post Method
    Route::post('/', [AuthController::class, 'Login'])->name('login.post');
});


// --- หน้าที่ "ต้องล็อกอิน" เท่านั้นถึงจะเข้าได้ ---
Route::middleware(['auth'])->group(function () {


    // หน้าสำหรับ User ทั่วไป หรือหน้า Dashboard รวม
    // Route::get('/User',function(){
    //     return Inertia::render('User/Dashboard');
    // })->name('user.dashboard');

    //ดึงข้อมูลมาแสดงหน้าเว็บ
    Route::get('/User', [ManageInfomationFile::class, 'ListFilePDFforDownLoad'])->name('user.dashboard');

    Route::get('/User/Downloads', [ManageInfomationFile::class, 'DownloadFilePDFs'])->name('user.downloadfiles');
    //Insert ข้อมูลการดาวน์ไฟล์
    Route::post('/User', [ManageInfomationFile::class, 'RecordDownloadFilePDFs'])->name('user.record');


    // หน้า Admin ที่คุณ Redirect มาหา กลุ่มที่ต้องเป็น "Admin" เท่านั้นถึงจะเข้าได้
    Route::middleware(['admin'])->group(function () {

        // Route::get('/Admin/Uploads',function(){
        //     return Inertia::render('Admin/Uploads/UploadFile');
        // })->name('admin.uploads');
        Route::get('/Admin/Users', [UsersInfomation::class, 'UsersInformation'])->name('admin.users');
        Route::post('/Admin/Users', [UsersInfomation::class, 'AddNewUsers'])->name('admin.addnewusers');
        Route::post('/Admin/Users/Update', [UsersInfomation::class, 'UpdateUsers'])->name('admin.updateusers');
        Route::post('/Admin/Users/Delete', [UsersInfomation::class, 'DeleteUsers'])->name('admin.deleteusers');


        Route::get('/Admin/Category', [CategoryFilesPDF::class, 'CategoryInfomation'])->name('admin.category');
        Route::post('/Admin/Category', [CategoryFilesPDF::class, 'AddNewCategory'])->name('admin.addcategory');
        Route::post('/Admin/Category/Update', [CategoryFilesPDF::class, 'UpdateCategory'])->name('admin.categoryupdate');
        Route::post('/Admin/Category/Delete', [CategoryFilesPDF::class, 'DeleteCategory'])->name('admin.categorydelete');

        Route::get('/Admin/History', [HistoryDownload::class, 'HistoryDownloadInformation'])->name('admin.history');

        //ดึงข้อมูลสำหรับหน้า Uploads File ของ admin
        Route::get("/Admin/Uploads", [UploadsFilePDF::class, 'UploadFilePDFInfomation'])->name('admin.uploads');

        //Upload files PDF to server
        Route::post('/Admin/Uploads', [UploadsFilePDF::class, 'UploadFilesPDF'])->name('admin.uploadfilepdf');
        Route::post('/Admin/Uploads/Update', [UploadsFilePDF::class, 'UploadUpdateInfor'])->name('admin.uploadupdate');
        Route::post('/Admin/Uploads/Delete', [UploadsFilePDF::class, 'DeleteFilesPDF'])->name('admin.deletefilespdf');

        //ดึงข้อมูลสำหรับหน้า Overview ของ admin
        Route::get("/Admin", [OverviewList::class, 'OverviewInfomation'])->name('admin.overview');
        Route::get('/Admin/exportReport-PDF', [OverviewList::class, 'generateReport']);


    });
    // Route::middleware('/Admin',function(){
    //     return Inertia::render('Admin/Dashboard');
    // })->name('admin.dashboard');


    // Route สำหรับ Logout
    Route::post('/logout', [AuthController::class, 'Logout'])->name('logout');
});
