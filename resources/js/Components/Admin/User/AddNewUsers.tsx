import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function AddNewUsersComponent() {
    // สร้าง State สำหรับควบคุมการเปิด-ปิดฟอร์ม
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // ตั้งค่า useForm ของ Inertia
    const { data, setData, post, processing, reset, errors } = useForm({
        username: '',
        password: '',
        name: '',
        role: '',
    });

    // ฟังก์ชันบันทึกข้อมูล
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/Admin/Users', {
            onSuccess: (page) => {
                const message =
                    (page.props as any).flash?.success || 'ทำรายการสำเร็จ';
                (document.getElementById('edit_modal') as any).close();
                Swal.fire({
                    title: 'สำเร็จ',
                    icon: 'success',
                    text: message,
                });
                reset();
            },
            onError: (err) => {
                //console.error(err);
                //Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัพโหลดไฟล์ได้', 'error');
                (document.getElementById('edit_modal') as any).close();
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    icon: 'error',
                    text: 'ไม่สามารถเพิ่มผู้ใช้งานใหม่ได้',
                });
            },
        });
    };

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-lg dark:bg-[#2B2A2A]">
                <h2 className="mb-6 text-xl font-bold dark:text-white">
                    {isFormOpen ? 'เพิ่มผู้ใช้ใหม่' : 'รายละเอียดผู้ใช้'}
                </h2>

                <div id="userDetailPanel">
                    {/* แสดงปุ่มเมื่อยังไม่ได้กดเพิ่มผู้ใช้ */}
                    {!isFormOpen && (
                        <div className="py-10 text-center">
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="btn w-full border-none bg-[#C3110C] text-[#E5C100] hover:bg-[#F63049]"
                            >
                                <i className="fas fa-user-plus mr-2"></i>
                                เพิ่มผู้ใช้ใหม่
                            </button>
                        </div>
                    )}
                </div>

                {/* ส่วนของฟอร์ม (จะแสดงเมื่อ isFormOpen เป็น true) */}
                {isFormOpen && (
                    <div id="userFormPanel">
                        <form onSubmit={submit}>
                            <div className="form-control mb-4 dark:text-white">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        ชื่อผู้ใช้ (Username)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full dark:bg-[#44444E] ${errors.username ? 'input-error' : ''}`}
                                    value={data.username}
                                    onChange={(e) =>
                                        setData('username', e.target.value)
                                    }
                                    placeholder="ระบุชื่อผู้ใช้งาน"
                                    required
                                />
                                {errors.username && (
                                    <span className="mt-1 text-xs text-error">
                                        {errors.username}
                                    </span>
                                )}
                            </div>
                            <div className="form-control relative mb-6 dark:text-white">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        รหัสผ่าน
                                    </span>
                                </label>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    className={`input-bordered input w-full dark:bg-[#44444E] ${errors.password ? 'input-error' : ''}`}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="ระบุรหัสผ่าน"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 mt-5 flex items-center pr-4">
                                    <button
                                        type="button"
                                        id="togglePassword"
                                        className="custom-gray hover:custom-primary cursor-pointer dark:bg-[#44444E]"
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {!showPass ? (
                                            <i className="fa-solid fa-eye-slash"></i>
                                        ) : (
                                            <i
                                                className="fas fa-eye"
                                                id="passwordIcon"
                                            ></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="form-control mb-4 dark:text-white">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        ชื่อบุคลากร (Full Name)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full dark:bg-[#44444E] ${errors.name ? 'input-error' : ''}`}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="ระบุชื่อ - นามสกุล"
                                    required
                                />
                            </div>

                            <div className="form-control mb-4 dark:text-white">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        บทบาท
                                    </span>
                                </label>
                                <select
                                    className={`select-bordered select w-full dark:bg-[#44444E] ${errors.role ? 'select-error' : ''}`}
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                    required
                                >
                                    <option value="">เลือกบทบาท</option>
                                    <option value="teacher">ครู</option>
                                    <option value="admin">ผู้ดูแลระบบ</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="btn flex-1 btn-outline dark:text-white"
                                    onClick={() => {
                                        setIsFormOpen(false);
                                        reset();
                                    }}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="btn flex-1 btn-primary"
                                    disabled={processing}
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {processing ? 'กำลังบันทึก...' : 'บันทึก'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
