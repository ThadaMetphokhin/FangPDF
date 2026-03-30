import { Head } from "@inertiajs/react"

import HeaderComponent from "@/Components/Admin/Header"
import SidebarComponent from "@/Components/Admin/Sidebar"
import TableListCategoryFilesComponent from "@/Components/Admin/Category/TableListCategory"
import AddNewCategoryComponent from "@/Components/Admin/Category/AddNewCategory"

export default function CategoryFilesPDF(){
    return(
        <>
        <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#44444E]">
                <Head title="จัดการหมวดหมู่" />

                {/*  Header ต้องอยู่บนสุดและเต็มความกว้าง */}
                <HeaderComponent />

                {/*  Container หลักที่แบ่งซ้าย-ขวา */}
                <div className="flex">
                    {/* Sidebar: ต้องล็อกความกว้างไว้ (w-64 หรือ w-72) และห้ามหดตัว (flex-shrink-0) */}
                    <aside className="min-h-screen flex-shrink-0">
                        <SidebarComponent />
                    </aside>

                    {/*  Content ฝั่งขวา: ต้องใส่ flex-1 เพื่อให้ "กินพื้นที่ที่เหลือทั้งหมด" */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        {/* Navbar (แถบเทาในรูป) */}
                        <div className="w-full border-b border-gray-200 bg-[#E9E9E9] px-6 py-3 ">
                            <div className="text-lg font-medium text-gray-700">
                                จัดการหมวดหมู่
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="space-y-6 p-6">
                            {/* รายการไฟล์ PDF ทั้งหมด */}
                            <div className="mb-4 rounded-xl bg-white p-6 shadow-lg dark:bg-[#2B2A2A]">
                                <h2 className="mb-6 text-xl font-bold dark:text-white">
                                    รายการหมวดมหมู่ทั้งหมด
                                </h2>
                                <TableListCategoryFilesComponent/>
                                <AddNewCategoryComponent/>
                            </div>
                            {/* <UploadFilesPDFComponent/> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}