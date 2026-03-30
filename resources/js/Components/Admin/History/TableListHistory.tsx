import { useRef, useEffect } from 'react';
import { Grid, html, h } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { usePage, useForm } from '@inertiajs/react';

import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';

dayjs.extend(buddhistEra);
dayjs.locale('th');

export default function TableListHistoryComponent() {
    const { historyDownload } = usePage().props as any;
    //console.log(historyDownload);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        // สร้าง Instance ภายใน useEffect เพื่อป้องกันการสร้างซ้ำทุกครั้งที่ re-render
        const grid = new Grid({
            columns: [
                {
                    name: 'ชื่อไฟล์',
                    width:"auto",
                    formatter: (cell) => {
                        return html(
                            `<div class="w-auto text-start">
                                <p class="whitespace-nowrap overflow-y-auto"><i class="fa-solid fa-file-pdf text-red-500"></i> ${cell}</p>
                            </div>`,
                        );
                    },
                },
                {
                    name: 'ผู้โหลดไฟล์',
                    width:"auto",
                    formatter: (cell) => {
                        return html(
                            `<i class="fa-solid fa-user text-gray-500"></i> ${cell}`,
                        );
                    },
                },
                {
                    name: 'วันที่ดาวน์โหลด',
                    width:"auto",
                    formatter: (cell: string) => {
                        const formatdate = dayjs(cell)
                            .locale('th')
                            .format('D MMM BBBB');
                        return html(
                            `<i class="fa-solid fa-calendar text-blue-500"></i> ${formatdate}`,
                        );
                    },
                },
                {
                    name: 'เวลาที่ดาวน์โหลด',
                    width:"auto",
                    formatter: (cell) => {
                        return html(
                            `<i class="fa-solid fa-clock text-orange-500"></i> ${cell}`,
                        );
                    },
                },
            ],
            data: () => {
                //console.log(data)
                const data = historyDownload.historyDownload;
                console.log(historyDownload)
                return data.map((data: any) => [
                    data.name_file,
                    data.who_download,
                    data.date_download,
                    data.time_download,
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

        //  Cleanup function เมื่อ component หายไป
        return () => {
            grid.destroy();
        };
    }, [historyDownload]); // จะทำงานใหม่เฉพาะเมื่อข้อมูลเปลี่ยน

    return <div ref={wrapperRef} />;
}
