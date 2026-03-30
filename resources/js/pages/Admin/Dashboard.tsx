import HeaderComponent from '@/Components/Admin/Header';
import SidebarComponent from '@/Components/Admin/Sidebar';
import SummaryStatsComponent from '@/Components/Admin/SummaryStats';
import ListLastDownLoad from '@/Components/Admin/TableListLastLoad';
import TableOverviewComponent from '@/Components/Admin/TableListOverview';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

import { DownloadPdfReport } from '@/Components/Admin/DowloadSummaryPDF';

interface User {
    id: number;
    name: string;
    role: string;
}

interface pageProps {
    auth: {
        user: User;
    };
    [key: string]: any; // สำหรับข้อมูลอื่นๆ ที่อาจส่งมา
}

export default function Dashboard() {
    const { auth } = usePage<pageProps>().props;

    const handleDownload = (): void => {
        window.open('/Admin/exportReport-PDF', '_blank');
        
    };
    //console.log(auth.user);
    return (
        <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#44444E]">
            <Head title="แดชบอร์ด" />

            {/*  Header ต้องอยู่บนสุดและเต็มความกว้าง */}
            <HeaderComponent />

            {/*  Container หลักที่แบ่งซ้าย-ขวา */}
            <div className="flex">
                {/*  Sidebar: ต้องล็อกความกว้างไว้ (w-64 หรือ w-72) และห้ามหดตัว (flex-shrink-0) */}
                <aside className="min-h-screen flex-shrink-0">
                    <SidebarComponent />
                </aside>

                {/*  Content ฝั่งขวา: ต้องใส่ flex-1 เพื่อให้ "กินพื้นที่ที่เหลือทั้งหมด" */}
                <div className="drawer flex min-w-0 flex-1 flex-col lg:drawer-open">
                    {/* Navbar (แถบเทาในรูป) */}
                    <nav className="grid w-full grid-cols-2 border-b border-gray-200 bg-[#E9E9E9] px-6 py-3">
                        <div className="col-start-1 col-end-3 text-lg font-medium text-gray-700">
                            แดชบอร์ด
                        </div>
                        <button
                            onClick={handleDownload}
                            className="col-span-2 col-end-7 gap-2 rounded-lg bg-green-600 px-5 py-2 text-white transition-colors hover:cursor-pointer hover:bg-green-700"
                        >
                            <i className="fa-solid fa-file-pdf"></i>{' '}
                            ดาวน์โหลดรายงาน
                        </button>
                    </nav>

                    {/* Main Content Area */}
                    <div className="space-y-6 p-6">
                        {/* Summary Stats (Cards 3 ใบ) */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                            {/* ส่วนนี้ให้คุณสร้าง Component Card มาใส่ตาม PHP เดิม */}
                            <SummaryStatsComponent />
                        </div>

                        {/* สรุปยอดดาวน์โหลดแต่ละไฟล์ */}
                        <div className="w-full rounded-xl bg-white p-6 shadow-lg dark:bg-[#2B2A2A]">
                            <h2 className="mb-6 text-xl font-bold text-[#2B2A2A] dark:text-white">
                                สรุปยอดดาวน์โหลดแยกตามประเภท
                            </h2>
                            <TableOverviewComponent />
                            <div id="stats_download_of_file"></div>
                        </div>

                        {/* การดาวน์โหลดล่าสุด */}
                        <div className="w-full rounded-xl bg-white p-6 shadow-lg dark:bg-[#2B2A2A]">
                            <h2 className="mb-6 text-xl font-bold text-[#2B2A2A] dark:text-white">
                                การดาวน์โหลดล่าสุด
                            </h2>
                            <ListLastDownLoad />
                            <div id="wrapper"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
