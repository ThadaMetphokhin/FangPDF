import { useRef, useEffect } from 'react';
import { Grid, html, h } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { usePage } from '@inertiajs/react';

import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';

dayjs.extend(buddhistEra);
dayjs.locale('th');

export default function ListLastDownLoad() {
    const { History } = usePage().props as any;
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        // สร้าง Instance ภายใน useEffect เพื่อป้องกันการสร้างซ้ำทุกครั้งที่ re-render
        const grid = new Grid({
            columns: [
                {
                    name: 'ชื่อไฟล์',
                    width:"auto",
                    formatter: (cell) =>
                        html(`
                            <div class="w-auto">
                                <p class="overflow-y-auto whitespace-nowrap"><i class="fas fa-file-pdf text-red-500"></i> ${cell}</p>
                            </div>
                            `),
                },
                {
                    name: 'ผู้โหลด',
                    formatter: (cell) =>
                        html(
                            `<i class="fa-solid fa-user text-gray-500"></i> ${cell}`,
                        ),
                },
                {
                    name: 'วันที่',
                    formatter: (cell) =>{
                        const formatdate = dayjs(cell as string).format('D MMM BBBB');
                        //console.log(formatdate)
                        return  html(
                            `<div class="text-center"><i class="fa-solid fa-calendar text-blue-500"></i> ${formatdate}</div>`,
                        )}
                },
                {
                    name: 'เวลา',
                    formatter: (cell) =>
                        html(
                            `<div class="text-center"><i class="fa-solid fa-clock text-orange-500"></i> ${cell}</div>`,
                        ),
                },
            ],
            data: () => {
                const data =History.lastLoad
                return data.map((data:any) => [
                    data.name_file || 'no name file',
                    data.who_download || 'no name download',
                    data.date_download || 'no date',
                    data.time_download || 'no time',
                ]);
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
                paginationButtonNext: 'hover:cursor-pointer dark:text-white !bg-transparent',
                paginationButtonPrev: 'hover:cursor-pointer dark:text-white !bg-transparent',
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
            sort:true,
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
    }, []); // จะทำงานใหม่เฉพาะเมื่อข้อมูลเปลี่ยน
    return <div ref={wrapperRef} />;
}
