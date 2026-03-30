import { Head } from "@inertiajs/react"

import HeaderComponent from "@/Components/Admin/Header"
import SidebarComponent from "@/Components/Admin/Sidebar"
import TableListHistoryComponent from "@/Components/Admin/History/TableListHistory"
import AddNewCategoryComponent from "@/Components/Admin/Category/AddNewCategory"
import SummaryHistoryComponent from "@/Components/Admin/History/SummaryHistory"



export default function HistoryDownloadFilePDF(){

   
    return(
        <>
        <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#44444E]">
                <Head title="ประวัติการดาวน์โหลด" />

                {/*  Header ต้องอยู่บนสุดและเต็มความกว้าง */}
                <HeaderComponent />

                {/*  Container หลักที่แบ่งซ้าย-ขวา */}
                <div className="flex">
                    {/*  Sidebar: ต้องล็อกความกว้างไว้ (w-64 หรือ w-72) และห้ามหดตัว (flex-shrink-0) */}
                    <aside className="min-h-screen flex-shrink-0">
                        <SidebarComponent />
                    </aside>

                    {/*  Content ฝั่งขวา: ต้องใส่ flex-1 เพื่อให้ "กินพื้นที่ที่เหลือทั้งหมด" */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        {/* Navbar (แถบเทาในรูป) */}
                        <nav className="w-full border-b border-gray-200 bg-[#E9E9E9] px-6 py-3">
                            <div className="text-lg font-medium text-gray-700">
                                ประวัติการดาวน์โหลด
                            </div>
                        </nav>

                        {/* Main Content Area */}
                        <div className="space-y-6 p-6">
                            {/* รายการไฟล์ PDF ทั้งหมด */}
                            <SummaryHistoryComponent/>
                            <div className="mb-4 rounded-xl bg-white p-6 shadow-lg dark:bg-[#2B2A2A]">
                                <h2 className="mb-6 text-xl font-bold dark:text-white">
                                    รายประวัติการดาวน์โหลดไฟล์ PDF
                                </h2>
                                <TableListHistoryComponent/>
                            </div>
                            {/* <UploadFilesPDFComponent/> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}