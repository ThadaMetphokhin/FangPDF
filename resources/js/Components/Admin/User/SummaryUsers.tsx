import { usePage } from '@inertiajs/react';

export default function SummaryUsersComponent() {
    const { ListUsers } = usePage().props as any;
   // console.log()
    return (
        <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                <div className="stats w-full bg-white dark:bg-[#2B2A2A] shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <div className="stat-icon  rounded p-2 dark:bg-white bg-[#C3110C]/20">
                                <i className="fas fa-users text-2xl text-[#E5C100]"></i>
                            </div>
                        </div>
                        <div className="stat-title md:text-lg text-[#2B2A2A] dark:text-white">
                            ผู้ใช้งานทั้งหมด
                        </div>
                        <div className="stat-value  text-[#2B2A2A] dark:text-white" >
                            {ListUsers.countUsers[0].count_users}
                        </div>
                        {/* <!-- <div className="stat-desc">+8 คนในเดือนนี้</div> --> */}
                    </div>
                </div>
            </div>
        </>
    );
}
