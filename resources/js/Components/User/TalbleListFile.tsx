import { usePage, useForm } from '@inertiajs/react';
import { Grid, html, h } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';

import { router } from '@inertiajs/react';

dayjs.extend(buddhistEra);
dayjs.locale('th');

interface ListFile {
    id: number;
    name_file: string;
    category_file: string;
    count_pages: number;
    size_file: number;
    upload_date: string;
    upload_time: string;
    count_download: number;
}

export default function TableListFileComponent({
    datalist,
}: {
    datalist: ListFile[];
}) {
    // ใช้ props datalist ที่ส่งมา หรือใช้ ListFile จาก usePage
    //const { ListFile } = usePage<{ ListFile: ListFile[] }>().props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { post, setData, data } = useForm({ name_file: '' });

    useEffect(() => {
        if (!wrapperRef.current) return;

        // สร้าง Instance ภายใน useEffect เพื่อป้องกันการสร้างซ้ำทุกครั้งที่ re-render
        const grid = new Grid({
            columns: [
                {
                    name: 'ชื่อไฟล์',
                    formatter: (cell) =>
                        html(`
                        <div class="w-60">
                            <p class="text-left overflow-y-auto whitespace-nowrap w-full">
                                <i class="fa-solid fa-file-pdf text-red-500"></i> ${cell}
                            </p>
                        </div>
                    `),
                },
                {
                    name: 'หมวดหมู่',
                    formatter: (cell) =>
                        html(
                            `<i class="fa-solid fa-layer-group text-green-500"></i> ${cell}`,
                        ),
                },
                {
                    name: 'จำนวนหน้า',
                    formatter: (cell) =>
                        html(
                            `<i class="fa-solid fa-file-lines text-orange-500"></i> ${cell}`,
                        ),
                },
                {
                    name: 'วันที่อัพโหลด',
                    formatter: (cell: any) => {
                        if (!cell || !cell[0]) return '-';
                        const formatdate = dayjs(cell[0]).format('D MMM BBBB');
                        return html(`
                            <div class="flex flex-col items-center justify-center">
                                <i class="fa-solid fa-calendar text-yellow-500"></i>
                                <span class="text-sm font-semibold">${formatdate}</span>
                                <span class="text-xs text-gray-400 italic">${cell[1]} น.</span>
                            </div>`);
                    },
                },
                {
                    name: 'จำนวนผู้ดาวน์โหลด',
                    hidden: window.innerWidth < 600,
                    formatter: (cell) =>
                        html(
                            `<i class="fa-solid fa-download text-blue-500"></i> ${cell}`,
                        ),
                },
                {
                    name: 'ขนาดไฟล์',
                    formatter: (cell) =>
                        html(`<i class="fa-solid fa-file"></i> ${cell} MB`),
                },
                {
                    name: 'โหลดไฟล์',
                    formatter: (_, row) => {
                        return h(
                            'button',
                            {
                                className:
                                    'text-sm rounded-md bg-[#E5C100]/20 p-2 hover:cursor-pointer hover:bg-green-600 hover:text-white transition-colors',
                                onClick: () => {
                                    const fileName = String(row.cells[0].data);
                                    setData('name_file', fileName);

                                    router.post(
                                        '/User',
                                        { name_file: fileName },
                                        {
                                            onSuccess: () => {
                                                // ✅ 2. ดาวน์โหลดไฟล์หลังบันทึกสำเร็จ
                                                window.open(
                                                    `/User/Downloads?file_name=${encodeURIComponent(fileName)}`,
                                                    '_blank',
                                                );
                                            },
                                            onError: (err) =>
                                                console.error(err),
                                        },
                                    );
                                },
                            },
                            [
                                h('i', {
                                    className:
                                        'fa-solid fa-file-arrow-down text-red-500 mr-2',
                                }),
                                'โหลดไฟล์',
                            ],
                        );
                    },
                },
            ],
            data: datalist.map((item) => [
                item.name_file,
                item.category_file,
                item.count_pages,
                [item.upload_date, item.upload_time],
                item.count_download,
                item.size_file,
                item.name_file,
            ]),
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
                paginationButtonNext: 'hover:cursor-pointer',
                paginationButtonPrev: 'hover:cursor-pointer',
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
            pagination: { limit: 5 },
            search: true,
            resizable: true,
        });

        //เคลียร์เนื้อหาเดิมก่อน Render (ป้องกัน Error "Not Empty")
        if (wrapperRef.current) {
            wrapperRef.current.innerHTML = '';
        }

        grid.render(wrapperRef.current);

        //Cleanup function เมื่อ component หายไป
        return () => {
            grid.destroy();
        };
    }, [datalist]); // จะทำงานใหม่เฉพาะเมื่อข้อมูลเปลี่ยน

    return <div ref={wrapperRef} />;
}
