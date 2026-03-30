import { usePage } from "@inertiajs/react";

export default function SummaryHistoryComponent() {
     const {historyDownload} = usePage().props as any;
    return (
        <>
            <div className="mb-8 w-full">
                <div className="stats w-full bg-white dark:bg-[#2B2A2A] shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <div className="stat-icon rounded p-2 dark:bg-white bg-[#E5C100]/50">
                                <i className="fa-solid fa-download text-2xl text-[#C3110C]"></i>
                            </div>
                        </div>
                        <div className="stat-title md:text-xl text-[#2B2A2A] dark:text-white">
                            ยอดดาวน์โหลดไฟล์ทั้งหมด
                        </div>
                        <div
                            className="stat-value text-[#2B2A2A]  dark:text-white"
                            id="total-users"
                        >
                            {historyDownload.countDown[0].count_history}
                        </div>
                        {/* <!-- <div className="stat-desc">+8 คนในเดือนนี้</div> --> */}
                    </div>
                </div>
            </div>
        </>
    );
}
