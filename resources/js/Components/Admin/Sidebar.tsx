import { usePage, Link } from '@inertiajs/react';
import ThemeToggle from '../ThemeToggle';

export default function SidebarComponent() {
    const { Disk } = usePage().props as any;
    // console.log(Disk)
    const Storage = Disk?.storage || null;
    //console.log(Storage)
    // ดึง url ปัจจุบันจาก Inertia (เช่น /Admin)
    const { url } = usePage();

    // ตัด query string ออกเพื่อให้เช็ค pathname ได้แม่นยำ
    const currentPath = url.split('?')[0];

    const pageArr = [
        { namepage: 'แดชบอร์ด', path: '/Admin' },
        { namepage: 'อัพโหลดไฟล์', path: '/Admin/Uploads' },
        { namepage: 'จัดการหมวดหมู่', path: '/Admin/Category' },
        { namepage: 'ประวัติการดาวน์โหลด', path: '/Admin/History' },
        { namepage: 'จัดการผู้ใช้', path: '/Admin/Users' },
    ];

    const percent = Storage?.maxGB ? (Storage.usedGB / Storage.maxGB) * 100 : 0;

    const color =
        percent >= 90
            ? 'bg-red-500'
            : percent >= 70
              ? 'bg-yellow-500'
              : 'bg-blue-500';

    return (
        <div className="drawer sticky top-10 z-50 lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

            <div className="drawer-side h-screen overflow-y-auto is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

                {/* กำหนดความกว้าง w-64 ตามมาตรฐาน Sidebar */}
                <div className="flex h-full w-60 flex-col bg-base-200 dark:bg-[#44444E]">
                    <div className="flex-grow p-6">
                        <h2 className="mt-15 mb-6 text-xl font-bold text-[#2B2A2A] lg:mt-0 dark:text-white">
                            เมนูจัดการ
                        </h2>

                        <ul className="menu space-y-2 p-0">
                            {pageArr.map((item, index) => {
                                // เช็คว่า path ปัจจุบันตรงกับเมนูนี้หรือไม่
                                const isActive = currentPath === item.path;

                                return (
                                    <li key={index}>
                                        <Link
                                            href={item.path}
                                            className={`flex w-full rounded-lg px-4 py-2 transition-all duration-200 dark:text-white ${
                                                isActive
                                                    ? 'border-l-4 border-[#E5C100] bg-[#C3110C] font-medium text-[#E5C100]'
                                                    : 'text-gray-700 hover:bg-red-100 active:bg-red-200 dark:hover:text-black'
                                            } `}
                                        >
                                            {item.namepage}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="divider my-8"></div>
                        <div className="flex gap-2 md:hidden">
                            <p>เปลี่ยนธีม</p>
                            <ThemeToggle />
                        </div>
                        {/* ส่วนพื้นที่จัดเก็บ (Storage Card) */}
                        <div className="rounded-2xl bg-[#F0F7FF] p-5 dark:bg-[#2B2A2A]">
                            <h3 className="mb-3 text-lg font-bold text-[#2B2A2A] dark:text-white">
                                พื้นที่จัดเก็บ
                            </h3>
                            <div className="mb-2">
                                <div className="mb-2 flex justify-between text-sm font-medium text-gray-600 dark:text-white">
                                    <span>
                                        ใช้ไปแล้ว {Storage?.usedGB || 0} GB
                                    </span>
                                    <span>{Storage?.usedGB || 0} %</span>
                                </div>
                                {/* ปรับแต่งสี Progress bar */}
                              
                                <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className={`${color} h-3 rounded-full transition-all duration-300`}
                                        style={{
                                            width: `${Math.min(percent, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-center text-xs font-medium text-gray-500 dark:text-white">
                                จากทั้งหมด {Storage?.maxGB || 0} GB
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
