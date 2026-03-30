import { usePage } from '@inertiajs/react';

export default function SummaryStatsComponent() {
    const { ListFiles } = usePage().props as any;
    //console.log(ListFiles.length);
    return (
        <>
            <div className="mb-8 flex items-center justify-center">
                <div className="stats items-center justify-center bg-white shadow dark:bg-[#2B2A2A]">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <div className="stat-icon rounded bg-[#E5C100]/20 p-2 dark:bg-white">
                                <i className="fas fa-file-pdf text-2xl text-[#C3110C]"></i>
                            </div>
                        </div>
                        <div className="dark:text-white">ไฟล์ทั้งหมด</div>
                        <div className="stat-value text-[#2B2A2A] dark:text-white">
                            {ListFiles.length}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
