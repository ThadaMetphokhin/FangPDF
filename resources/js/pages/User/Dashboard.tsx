import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

import HeaderComponent from '@/Components/User/Header';
import SummaryStatsComponent from '@/Components/User/SummaryStats';

import TableListFileComponent from '@/Components/User/TalbleListFile';

import FooterComponent from '@/Components/User/Footer';

interface TypeListFile {
    id: number;
    name_file: string;
    category_file: string;
    count_pages: number;
    size_file: number;
    upload_date: string;
    upload_time: string;
    count_download: number; // ค่าที่ได้จากการ COUNT ใน Query
}

export default function UserDashboard() {
    const { ListFiles } = usePage().props as any;
    //console.log(ListFiles);
    return (
        <>
            <HeaderComponent />
            <div className="mx-auto px-1 py-5 dark:bg-[#44444E]">
                <div className="flex-1 gap-8">
                    <SummaryStatsComponent />
                </div>
                {/* <!-- File List --> */}
                <div className="rounded-xl mb-30 bg-white dark:bg-[#2B2A2A] p-2 md:p-10 shadow-lg lg:col-span-4">
                    <h2 className="mb-6 text-xl font-bold text-[#2B2A2A] dark:text-white">
                        สรุปยอดดาวน์โหลดแต่ละไฟล์
                    </h2>
                    <TableListFileComponent datalist={ListFiles} />
                </div>
            </div>
            <FooterComponent />
        </>
    );
}
