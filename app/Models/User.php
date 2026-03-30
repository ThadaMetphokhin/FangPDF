<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory>HasFactory */
    use  Notifiable;


    // ระบุชื่อตารางให้ตรงกับในรูป
    protected $table = 'users';
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    // ระบุคอลัมน์ที่อนุญาตให้จัดการข้อมูล
    protected $fillable = [
        'username',
        'password',
        'name',
        'role',
    ];


    // ปิด timestamps เพราะในตารางคุณไม่มีคอลัมน์ created_at / updated_at
    public $timestamps = false;
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'username',
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    // protected function casts(): array
    // {
    //     return [
    //         'email_verified_at' => 'datetime',
    //         'password' => 'hashed',
    //     ];
    // }
    // protected function casts(): array
    // {
    //     return [
    //         // เก็บไว้หากคุณเปลี่ยนไปใช้การ Hash รหัสผ่าน (ซึ่งควรทำอย่างยิ่ง)
    //         'password' => 'hashed',
    //     ];
    // }
}
