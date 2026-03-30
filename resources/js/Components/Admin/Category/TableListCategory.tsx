import React, { useRef, useEffect } from 'react';
import { Grid, html, h } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { usePage, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

import Swal from 'sweetalert2';

export default function TableListCategoryFilesComponent() {
    // const data1 = usePage().props as any;
    // console.log(data1);
    const { cateFiles } = usePage().props as any;
    const { data, setData, processing, errors, post, reset } = useForm({
        id: '',
        name_cate: '',
    });
    //console.log(cateFiles.listCategory)
    const wrapperRef = useRef<HTMLDivElement>(null);

    // ฟังก์ชันสำหรับเปิด Modal และยัดข้อมูลใส่ useForm
    const openEditModal = (item: any) => {
        setData({
            id: item.id,
            name_cate: item.name_cate,
        });
        (document.getElementById('edit_modal') as any).showModal();
    };

    // ฟังก์ชันบันทึก
    const update = (e: React.FormEvent) => {
        e.preventDefault();
        post('/Admin/Category/Update', {
            onSuccess: () => {
                (document.getElementById('edit_modal') as any).close();
                Swal.fire({
                    title: 'สำเร็จ',
                    icon: 'success',
                    text: 'อัพเดตข้อมูลสำเร็จ',
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
                    text: 'ไม่สามารถอัพโหลดไฟล์ได้',
                });
            },
        });
    };

    //function delete
    const deleteCategory = (id: string, name: string) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton:
                    'btn bg-green-500 hover:bg-green-600 text-white mx-2 border-none',
                cancelButton:
                    'btn bg-red-500 hover:bg-red-600 text-white mx-2 border-none',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: 'ต้องการลบหมวดมหมู่นี้หรือไม่ ?',
                text: name,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ไม่',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    router.post(
                        '/Admin/Category/Delete',
                        { id: id, name_cate: name },
                        {
                            onSuccess: (page) => {
                                //console.log(res);
                                const message =
                                    (page.props as any).flash?.success ||
                                    'ทำรายการสำเร็จ';
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
                                    text: 'ไม่สามารถอัพโหลดไฟล์ได้',
                                });
                            },
                        },
                    );
                }
            });
    };

    useEffect(() => {
        if (!wrapperRef.current) return;

        //สร้าง Instance ภายใน useEffect เพื่อป้องกันการสร้างซ้ำทุกครั้งที่ re-render
        const grid = new Grid({
            columns: [
                {
                    name: 'ลำดับ',
                    width: 'auto',
                    formatter: (cell) => {
                        return html(
                            `<i class="fa-solid fa-hashtag"></i> ${cell}`,
                        );
                    },
                },
                {
                    name: 'หมวดหมู่',
                    width: 'auto',
                    formatter: (cell) => {
                        return html(
                            `<i class="fa-solid fa-layer-group bg-clip-text text-transparent bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500"></i> ${cell}`,
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
                                    'flex flex-col md:flex-row justify-center gap-2',
                            },
                            [
                                // ปุ่มแก้ไข
                                h(
                                    'button',
                                    {
                                        className:
                                            'btn bg-yellow-400 hover:bg-yellow-300 text-black btn-sm border-none',
                                        onClick: () => {
                                            openEditModal({
                                                id: d[0], // สมมติว่า id อยู่ column แรก
                                                name_cate: d[1],
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
                                            deleteCategory(d[0], d[1]);
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
                const cate = cateFiles.listCategory;
                return cate.map((data: any, i: number) => {
                    return [
                        i + 1,
                        data.name || 'ไม่มีชื่อ',
                        [data.id || '', data.name || ''],
                    ];
                });
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
    }, [cateFiles]); // จะทำงานใหม่เฉพาะเมื่อข้อมูลเปลี่ยน
    return (
        <>
            <div ref={wrapperRef} />
            <dialog
                id="edit_modal"
                className="modal modal-bottom sm:modal-middle"
            >
                {/* เปลี่ยนตัวนอกสุดของเนื้อหาให้เป็น <div> ไม่ใช่ <form> */}
                <div className="relative modal-box max-w-md text-left">
                    {/* 2. ฟอร์มปุ่มปิดตัว X (แยกอิสระ) */}
                    <form method="dialog">
                        <button className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">
                            ✕
                        </button>
                    </form>

                    <h3 className="mb-4 text-center text-lg font-bold text-primary">
                        แก้ไขข้อมูลไฟล์
                    </h3>

                    {/* ฟอร์มหลักสำหรับส่งข้อมูล (ห้ามมี <form> อื่นข้างในนี้) */}
                    <form onSubmit={update} className="space-y-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    ชื่อหมวดหมู่ ( Category )
                                </span>
                            </label>
                            <input
                                type="text"
                                className="input-bordered input w-full focus:input-primary"
                                value={data.name_cate}
                                onChange={(e) =>
                                    setData('name_cate', e.target.value)
                                }
                            />
                            {errors.name_cate && (
                                <span className="mt-1 text-xs text-error">
                                    {errors.name_cate}
                                </span>
                            )}
                        </div>

                        {/* <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    หมวดหมู่
                                </span>
                            </label>
                            <select
                                value={data.name_cate}
                                onChange={(e) =>
                                    setData('name_cate', e.target.value)
                                }
                                className="select-bordered select w-full focus:select-primary"
                            >
                                {cate &&
                                    cate.map((cat: any) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                            </select>
                        </div> */}

                        {/* <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    คำอธิบาย
                                </span>
                            </label>
                            <textarea
                                value={data.comment}
                                className="textarea-bordered textarea h-24 w-full focus:textarea-primary"
                                onChange={(e) =>
                                    setData('comment', e.target.value)
                                }
                            />
                        </div> */}

                        <div className="modal-action flex justify-end gap-2">
                            {/* ปุ่มบันทึก (เป็น type="submit" ของฟอร์มหลัก) */}
                            <button
                                className="btn px-8 btn-primary"
                                type="submit"
                                disabled={processing}
                            >
                                บันทึกการแก้ไข
                            </button>

                            {/* ปุ่มยกเลิก (แยกออกมาเป็นอีกฟอร์ม หรือใช้ method="dialog") */}
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    (
                                        document.getElementById(
                                            'edit_modal',
                                        ) as any
                                    ).close()
                                }
                            >
                                ยกเลิก
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
