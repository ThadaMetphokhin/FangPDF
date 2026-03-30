import { useRef, useEffect } from 'react';
import { Grid, html, h } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { usePage, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

import Swal from 'sweetalert2';

import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';

dayjs.extend(buddhistEra);
dayjs.locale('th');

export default function TableListFilePDFComponent() {
    const { ListFiles } = usePage().props as any;
    const cate = ListFiles.categoryFile;
    //console.log(cate);
    const { data, setData, processing, post, reset, errors } = useForm({
        id: '',
        name_file: '',
        category: '',
        comment: '',
    });
    // console.log(ListFiles);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // ฟังก์ชันสำหรับเปิด Modal และยัดข้อมูลใส่ useForm
    const openEditModal = (item: any) => {
        setData({
            id: item.id,
            name_file: item.name_file,
            category: item.category_file,
            comment: item.comment || '',
        });
        (document.getElementById('edit_modal') as any).showModal();
    };

    // ฟังก์ชันบันทึก
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/Admin/Uploads/Update', {
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
                console.error(err);
                //Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัพโหลดไฟล์ได้', 'error');
                (document.getElementById('edit_modal') as any).close();
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    icon: 'error',
                    text: 'ไม่สามารถอัพเดตข้อมูลได้',
                });
            },
        });
    };

    const deleteFilesPDFs = (id: string, name_file: string) => {
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
                title: 'ต้องการลบไฟล์ PDF นี้หรือไม่ ?',
                text: 'ชื่อไฟล์: ' + name_file,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ไม่',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    router.post(
                        '/Admin/Uploads/Delete',
                        { id: id, name_file: name_file },
                        {
                            onSuccess: (page) => {
                                //console.log(res);
                                const message =
                                    (page.props as any).flash?.success ||
                                    'ทำการลบไฟล์สำเร็จ';
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
                                console.error(err);
                                //Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัพโหลดไฟล์ได้', 'error');
                                (
                                    document.getElementById('edit_modal') as any
                                ).close();
                                Swal.fire({
                                    title: 'เกิดข้อผิดพลาด',
                                    icon: 'error',
                                    text: 'ไม่สามารถลบไฟล์ได้',
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
                    name: 'ชื่อไฟล์',
                    width: 'auto',
                    formatter: (cell) => {
                        return html(`
                            <div class="w-auto text-start">
                                <p class="whitespace-nowrap overflow-y-auto"><i class="fa-solid fa-file-pdf text-red-500 "></i> ${cell}</p>
                            </div>
                        `);
                    },
                },
                {
                    name: 'หมวดหมู่',
                    width: 'auto',
                    formatter: (cell) =>
                        html(
                            `<i class="fa-solid fa-layer-group text-green-500"></i> ${cell}`,
                        ),
                },
                {
                    name: 'ผู้อัพโหลด',
                    width: 'auto',
                    formatter: (cell) => {
                        return html(
                            `<i class="fa-solid fa-circle-user text-gray-400"></i> ${cell} `,
                        );
                    },
                },
                {
                    name: 'วันที่อัพโหลด',
                    width: 'auto',
                    formatter: (cell: [string, string]) => {
                        const formatdate = dayjs(cell[0])
                            .locale('th')
                            .format('D MMM BBBB');
                        const time = cell[1];
                        return html(`
                                <div class="flex flex-col items-center justify-center gap-0">
                                    <i class="fa-solid fa-calendar text-yellow-500"></i>
                                    <span class="text-sm font-semibold text-base-content dark:text-white">${formatdate}</span>
                                    <span class="text-xs text-gray-400 italic">${time} น.</span>
                                </div>`);
                    },
                },
                {
                    name: 'จำนวนหน้า',
                    width: 'auto',
                    formatter: (cell) =>
                        html(
                            `<i class="fa-solid fa-file-lines text-orange-500"></i> ${cell}`,
                        ),
                },
                {
                    name: 'ขนาดไฟล์',
                    width: 'auto',
                    formatter: (cell) =>
                        html(`<i class="fa-solid fa-file"></i> ${cell} MB`),
                },
                {
                    name: 'แก้ไข',
                    width: 'auto',
                    formatter: (cell, row: any) => {
                        // ดึงข้อมูลจากคอลัมน์ที่ 6 (Index 6) ที่คุณเก็บเป็น Array [id, name, cat, comment]
                        const d = row.cells[6].data;
                        //console.log(d)
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
                                                id: d[0],
                                                name_file: d[1],
                                                category_file: d[2],
                                                comment: d[3],
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
                                            deleteFilesPDFs(d[0], d[1]);
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
                const data = ListFiles.listFiles;
                const cate = ListFiles.categoryFile;
                //console.log(data)
                return data.map((item: any) => {
                    return [
                        item.name_file || 'ไม่มีชื่อไฟล์',
                        item.category_file || 'ไม่มีหมวดหมู่',
                        item.who_upload || 'ไม่ระบุ',
                        [item.upload_date || '', item.upload_time || ''],
                        item.count_pages || 0,
                        item.size_file || 0,
                        [
                            item.id || '',
                            item.name_file || '',
                            item.category_file || '',
                            item.comment_file || '',
                        ],
                    ];
                });
            },
            style: {
                th: { 'text-align': 'center' },
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

        //เคลียร์เนื้อหาเดิมก่อน Render (ป้องกัน Error "Not Empty")
        if (wrapperRef.current) {
            wrapperRef.current.innerHTML = '';
        }

        grid.render(wrapperRef.current);

        // Cleanup function เมื่อ component หายไป
        return () => {
            grid.destroy();
        };
    }, [ListFiles]); // จะทำงานใหม่เฉพาะเมื่อข้อมูลเปลี่ยน
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

                    {/* 3. ฟอร์มหลักสำหรับส่งข้อมูล (ห้ามมี <form> อื่นข้างในนี้) */}
                    <form onSubmit={submit} className="space-y-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    ชื่อไฟล์ (Title)
                                </span>
                            </label>
                            <input
                                type="text"
                                className="input-bordered input w-full focus:input-primary"
                                value={data.name_file}
                                onChange={(e) =>
                                    setData('name_file', e.target.value)
                                }
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    หมวดหมู่
                                </span>
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
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
                        </div>

                        <div className="form-control w-full">
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
                        </div>

                        <div className="modal-action flex justify-end gap-2">
                            {/* ปุ่มบันทึก (เป็น type="submit" ของฟอร์มหลัก) */}
                            <button
                                className="btn px-8 btn-primary"
                                type="submit"
                                disabled={processing}
                            >
                                บันทึกการแก้ไข
                            </button>

                            {/* 4. ปุ่มยกเลิก (แยกออกมาเป็นอีกฟอร์ม หรือใช้ method="dialog") */}
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
