import { useRef, useEffect } from 'react';
import { Grid, html, h } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

import Swal from 'sweetalert2';

export default function TableListUsersComponent() {
    const [showPass, setShowPass] = useState(false);
    const { data, setData, errors, processing, post, reset } = useForm({
        id: '',
        username: '',
        password: '',
        name: '',
        role: '',
    });

    const { ListUsers } = usePage().props as any;

    const wrapperRef = useRef<HTMLDivElement>(null);

    // ฟังก์ชันสำหรับเปิด Modal และยัดข้อมูลใส่ useForm
    const openEditModal = (item: any) => {
        setData({
            id: item.id,
            username: item.username,
            password: item.password,
            name: item.name,
            role: item.role,
        });
        (document.getElementById('edit_modal') as any).showModal();
    };

    const updateUsers = (e: React.FormEvent) => {
        e.preventDefault();
        (document.getElementById('edit_modal') as any).close();
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                container: '!z-[999999]',
                confirmButton:
                    'btn bg-green-500 hover:bg-green-600 text-white mx-2 border-none',
                cancelButton:
                    'btn bg-red-500 hover:bg-red-600 text-white mx-2 border-none',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: 'ต้องการแก้ไขข้อมูลผู้ใช้งานนี้หรือไม่ ?',
                text: data.name,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ไม่',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    post('/Admin/Users/Update', {
                        onSuccess: (page) => {
                            //console.log(res);
                            const message =
                                (page.props as any).flash?.success ||
                                'อัพเดตข้อมูลผู้ใช้งานสำเร็จ';
                            (
                                document.getElementById('edit_modal') as any
                            ).close();
                            Swal.fire({
                                title: 'สำเร็จ',
                                icon: 'success',
                                text: `${message}`,
                            });
                            reset();
                        },
                        onError: (err) => {
                            // console.error(err);
                            //Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัพโหลดไฟล์ได้', 'error');
                            (
                                document.getElementById('edit_modal') as any
                            ).close();
                            Swal.fire({
                                title: 'เกิดข้อผิดพลาด',
                                icon: 'error',
                                text: 'ไม่สามารถแก้ไขข้อมูลผู้ใช้งานได้',
                            });
                        },
                    });
                }
            });
    };

    const deleteUsers = (id: string, username: string, name: string) => {
        // console.log(id,username,name);

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                container: '!z-[999999]',
                confirmButton:
                    'btn bg-green-500 hover:bg-green-600 text-white mx-2 border-none',
                cancelButton:
                    'btn bg-red-500 hover:bg-red-600 text-white mx-2 border-none',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: `ต้องการลบข้อมูลผู้ใช้งาน ${username} นี้หรือไม่ ?`,
                text: data.name,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ไม่',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    router.post(
                        '/Admin/Users/Delete',
                        {
                            id: id,
                            username: username,
                            name: name,
                        },
                        {
                            onSuccess: (page) => {
                                //console.log(res);
                                const message =
                                    (page.props as any).flash?.success ||
                                    'ลบข้อมูลผู้ใช้งานสำเร็จ';
                                Swal.fire({
                                    title: 'สำเร็จ',
                                    icon: 'success',
                                    text: `${message}`,
                                });
                            },
                            onError: (err) => {
                                console.error(err);
                                //Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัพโหลดไฟล์ได้', 'error');
                                Swal.fire({
                                    title: 'เกิดข้อผิดพลาด',
                                    icon: 'error',
                                    text: 'ไม่สามารถลบข้อมูลผู้ใช้งานได้',
                                });
                            },
                        },
                    );
                }
            });
    };

    useEffect(() => {
        if (!wrapperRef.current) return;

        // สร้าง Instance ภายใน useEffect เพื่อป้องกันการสร้างซ้ำทุกครั้งที่ re-render
        const grid = new Grid({
            columns: [
                {
                    name: 'ชื่อผู้ใช้งาน',
                    width: 'auto',
                    formatter: (cell) => {
                        return html(
                            `<div class="w-auto text-start">
                                <p class="whitespace-nowrap overflow-y-auto"><i class="fa-solid fa-address-card text-blue-500"></i> ${cell}</p>
                            </div>`,
                        );
                    },
                },
                {
                    name: 'บทบาท',
                    width: 'auto',
                    formatter: (cell) => {
                        return cell == 'admin'
                            ? html(
                                  `<i class="fa-solid fa-flag text-red-500"></i> ${cell}`,
                              )
                            : html(
                                  `<i class="fa-solid fa-flag text-green-500"></i> ${cell}`,
                              );
                    },
                },
                {
                    name: 'จัดการหมวดหมู่',
                    width: 'auto',
                    formatter: (cell, row: any) => {
                        // ดึงข้อมูลจากคอลัมน์ที่ 2 (Index 2) ที่คุณเก็บเป็น Array [id, name_cate]

                        const d = row.cells[2].data;
                        //console.log(d);
                        return h(
                            'div',
                            {
                                className:
                                    'flex flex-col md:flex-row justify-center gap-2 ',
                            },
                            [
                                // ปุ่มแก้ไข
                                h(
                                    'button',
                                    {
                                        className:
                                            'btn bg-yellow-400 hover:bg-yellow-300 text-black text-ms btn-sm border-none',
                                        onClick: () => {
                                            openEditModal({
                                                id: d[0], // สมมติว่า id อยู่ column แรก
                                                username: d[1],
                                                password: d[2],
                                                name: d[3],
                                                role: d[4],
                                            });
                                        },
                                    },
                                    [
                                        h('i', {
                                            className:
                                                'fa-solid fa-pen-to-square mr-1',
                                        }),
                                        ' แก้ไข',
                                    ],
                                ),

                                // ปุ่มลบ
                                h(
                                    'button',
                                    {
                                        className:
                                            'btn bg-red-500 hover:bg-red-400 text-white btn-sm border-none',
                                        onClick: () => {
                                            // เรียก function ลบของคุณตรงๆ ได้เลย
                                            deleteUsers(d[0], d[1], d[3]);
                                        },
                                    },
                                    [
                                        h('i', {
                                            className: 'fa-solid fa-trash mr-1',
                                        }),
                                        ' ลบ',
                                    ],
                                ),
                            ],
                        );
                    },
                },
            ],
            data: () => {
       
                const data = ListUsers.listUsers;
                        // console.log(data)
                return data.map((data: any) => [
                    data.name,
                    data.role,
                    [
                        data.id,
                        data.username,
                        data.password,
                        data.name,
                        data.role,
                    ],
                ]);
            },
            style: {
                th: { 'text-align': 'center' },
                td: { 'text-align': 'center' },
            },
            className: {
                table: 'w-full bg-white dark:bg-[#2B2A2A]  dark:border-white text-slate-900 dark:text-slate-100 !bg-transparent',
                thead: 'bg-gray-50 dark:bg-[#333333] !bg-transparent',
                th: 'text-black dark:!text-white border-b border-gray-200 dark:border-white  px-4 py-3 text-center !bg-transparent', // !bg-transparent สำคัญมาก
                td: 'px-4 py-3 border-b border-gray-100 dark:border-white dark:!bg-[#2B2A2A]  text-center !bg-transparent', // เพื่อให้สีพื้นหลังมาจาก table class
                footer: 'bg-gray-50 dark:bg-[#2B2A2A] border-t border-gray-200 dark:border-white !bg-transparent',
                search: 'bg-white   dark:text-[#2B2A2A]] dark:border-gray-600 dark:bg-[#2B2A2A] !bg-transparent',
                pagination: 'dark:text-[#2B2A2A]',
                paginationSummary:
                    'dark:bg-[#2B2A2A] dark:text-white hover:cursur-pointer !bg-transparent',
                paginationButton:
                    'dark:bg-[#2B2A2A] dark:text-white hover:cursur-pointer !bg-transparent',
                paginationButtonNext:
                    'hover:cursor-pointer dark:text-white !bg-transparent',
                paginationButtonPrev:
                    'hover:cursor-pointer dark:text-white !bg-transparent',
            },
            language: {
                loading: 'กำลังโหลดข้อมูล กรุณารอสักครู่...',
                noRecordsFound: 'ไม่พบข้อมูลที่ท่านต้องการ',
                search: { placeholder: '🔍 ค้นหาข้อมูล...' },
                pagination: {
                    previous: 'ก่อนหน้า',
                    next: 'ถัดไป',
                    showing: 'แสดง',
                    results: () => 'รายการ',
                },
            },
            sort: true,
            pagination: { limit: 5 },
            search: true,
            resizable: true,
        });

        // เคลียร์เนื้อหาเดิมก่อน Render (ป้องกัน Error "Not Empty")
        if (wrapperRef.current) {
            wrapperRef.current.innerHTML = '';
        }

        grid.render(wrapperRef.current);

        // Cleanup function เมื่อ component หายไป
        return () => {
            grid.destroy();
        };
    }, [ListUsers]); // จะทำงานใหม่เฉพาะเมื่อข้อมูลเปลี่ยน
    return (
        <>
            <div ref={wrapperRef} />
            <dialog
                id="edit_modal"
                className="modal modal-bottom sm:modal-middle"
            >
                {/* เปลี่ยนตัวนอกสุดของเนื้อหาให้เป็น <div> ไม่ใช่ <form> */}
                <div className="relative modal-box max-w-md text-left dark:bg-[#2B2A2A]">
                    {/* ฟอร์มปุ่มปิดตัว X (แยกอิสระ) */}
                    <form method="dialog">
                        <button type='button' className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm dark:text-white">
                            ✕
                        </button>
                    </form>

                    <h3 className="mb-4 text-center text-lg font-bold text-primary">
                        แก้ไขข้อมูลผู้ใช้{' '}
                        <span className="text-yellow-600 dark:text-yellow-200">
                            ( {data.name} )
                        </span>
                    </h3>

                    <form onSubmit={updateUsers}>
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
                                //required={!isFormOpen} // ถ้าเพิ่มใหม่ต้องกรอก
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
                                className={`select-bordered select w-full dark:bg-[#44444E]`} // ${errors.role ? 'select-error' : ''}`}
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

                {/* ส่วนคลิกพื้นหลังเพื่อปิด */}
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
