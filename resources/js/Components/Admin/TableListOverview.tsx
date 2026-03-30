import { useRef, useEffect } from 'react';
import { Grid, html, h } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { usePage } from '@inertiajs/react';

import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';

dayjs.extend(buddhistEra);
dayjs.locale('th');

export default function TableOverviewComponent() {
    const { Overview } = usePage().props as any;
    //console.log(Overview);
    //console.log(Overview);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        // สร้าง Instance ภายใน useEffect เพื่อป้องกันการสร้างซ้ำทุกครั้งที่ re-render
        const grid = new Grid({
            columns: [
                {
                    name: 'ชื่อไฟล์',
                    width: 'auto',
                    formatter: (cell) => {
                        return html(`
                            <div class="w-auto">
                                <p class=" overflow-y-auto whitespace-nowrap"><i class="fas fa-file-pdf text-green-500"></i> ${cell}</p>
                            </div>
                            `);
                    },
                },

                {
                    name: 'ยอดดาวน์โหลด',
                    formatter: (cell: any) => {
                        //console.log(cell)
                        const count_download_file = cell[0];
                        const totalall_teacher = cell[1];
                        const cal =
                            (count_download_file /
                                totalall_teacher[0].teacher) *
                            100;

                        return html(
                            `
                  <div class='flex flex-col items-center '>
                    <div class="circular-progress m-2  h-30"  style="background: conic-gradient(#FF7F11 0% ${cal.toFixed(2)}%, #e5e7eb 0% 100%);">
                        <span class="progress-value -mt-1">${cal.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                      <span class="text-gray-600 dark:text-white">การดาวน์โหลดไฟล์: </span>
                      <span class="font-medium text-green-600 dark:text-white">${count_download_file}</span>
                  </div>
                  <div class="flex justify-between items-center mt-1">
                      <span class="text-gray-600 dark:text-white">จากครูทั้งหมด:</span>
                      <span class="font-medium text-yellow-600 dark:text-white">${totalall_teacher[0].teacher}</span>
                  </div>
                  `,
                        );
                    },
                },
            ],
            data: () => {
                const Alldata = Overview.historyDownload;
                const totalteacher = Overview.teacherDownload;
                console.log(Alldata)
                return Alldata.map((data: any) => [
                    data.name_file || 'no name file',
                    [data.count_download || 0, totalteacher || null],
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
    }, []); // จะทำงานใหม่เฉพาะเมื่อข้อมูลเปลี่ยน

    return <div ref={wrapperRef} />;
}
