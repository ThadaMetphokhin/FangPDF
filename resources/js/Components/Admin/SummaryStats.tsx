import { usePage } from "@inertiajs/react";

export default function SummaryStatsComponent() {

    const {Stats} = usePage().props as any;
    //console.log(Stats)
    const Allfiles = Stats.allFiles[0].value
    const AllDonwLoad = Stats.historyDownload[0].value;
    const AllUsers = Stats.allUsers[0].value;
    return (
        <>
            <div className="mb-8 flex items-center justify-center gap-6">
                <div className="stats w-full bg-white dark:bg-[#2B2A2A] shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary ">
                            <div className="stat-icon rounded p-2 bg-[#E5C100]/20 dark:bg-white/80">
                                <i className="fas fa-file-pdf text-2xl text-[#C3110C]"></i>
                            </div>
                        </div>
                        <div className="stat-title dark:text-white">ไฟล์ทั้งหมด</div>
                        <div className="stat-value text-primary dark:text-white">{Allfiles}</div>
                        {/* <!-- <div className="stat-desc">+5 ไฟล์ในเดือนนี้</div> --> */}
                    </div>
                </div>

                <div className="stats w-full bg-white dark:bg-[#2B2A2A] shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <div className="stat-icon rounded p-2 bg-[#E5C100]/20 dark:bg-white/80">
                                <i className="fas fa-download text-2xl text-secondary"></i>
                            </div>
                        </div>
                        <div className="stat-title dark:text-white">ดาวน์โหลดทั้งหมด</div>
                        <div className="stat-value text-secondary  dark:text-white">{AllDonwLoad}</div>
                        {/* <!-- <div className="stat-desc">↗︎ 1,234 (12%)</div> --> */}
                    </div>
                </div>

                <div className="stats w-full bg-white dark:bg-[#2B2A2A] shadow">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <div className="stat-icon rounded p-2 bg-[#E5C100]/20 dark:bg-white/80">
                                <i className="fas fa-users text-2xl text-accent"></i>
                            </div>
                        </div>
                        <div className="stat-title dark:text-white">ผู้ใช้งาน</div>
                        <div className="stat-value text-accent dark:text-white">{AllUsers}</div>
                        {/* <!-- <div className="stat-desc">+8 ใหม่ในเดือนนี้</div> --> */}
                    </div>
                </div>

                {/* <!-- <div className="stats shadow bg-white">
        <div className="stat">
            <div className="stat-figure text-info">
                <div className="stat-icon bg-info/20">
                    <i className="fas fa-hdd text-info text-2xl"></i>
                </div>
            </div>
            <div className="stat-title">พื้นที่ใช้ไป</div>
            <div className="stat-value text-info">6.8 GB</div>
            <div className="stat-desc">68% จาก 10 GB</div>
        </div>
    </div> --> */}
            </div>
        </>
    );
}
