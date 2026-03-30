import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import ThemeToggle from '../ThemeToggle';

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

export default function HeaderComponent() {
    const { auth } = usePage<pageProps>().props as any;
    //console.log(auth.user)
    return (
        <>
            <header className="sticky top-0 z-30 sm:z-[60]">
                <div className="navbar border-b bg-[#800000] shadow-lg">
                    <label
                        htmlFor="my-drawer-4"
                        aria-label="open sidebar"
                        className="btn mr-1 btn-square btn-ghost lg:hidden"
                    >
                        {/* <!-- Sidebar toggle icon --> */}

                        <i className="fa-solid fa-bars text-white"></i>
                    </label>
                    <div className="flex-1">
                        <div className="flex items-center">
                            <div className="mr-3 rounded-lg bg-gradient-to-r from-red-600 to-yellow-600 p-2">
                                <i className="fas fa-user-shield text-xs text-white md:text-2xl"></i>
                            </div>
                            <div>
                                <h1 className="mr-1 -indent-1 text-[0.75rem] font-bold text-nowrap text-white md:indent-0 md:text-2xl">
                                    ระบบจัดการไฟล์ PDF ( Admin )
                                </h1>
                                <p className="md:text-md hidden text-[0.8rem] text-[#E5C100] sm:text-sm md:block lg:text-xl">
                                    ควบคุมและจัดการไฟล์ PDF ทุกรายการ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn avatar btn-circle btn-ghost"
                            >
                                <div className="flex w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-yellow-600 text-white">
                                    <span
                                        className="font-bold"
                                        id="admin_name_icon"
                                    >
                                        {auth.user.name.slice(0, 1)}
                                    </span>
                                </div>
                            </div>

                            <ul
                                tabIndex={0}
                                className="dropdown-content menu z-[1] mt-3 -mr-20 w-100 menu-sm rounded-box bg-base-100 p-10 md:p-4 shadow"
                            >
                                <li className="menu-title text-lg md:text-sm">
                                    <span>ผู้ดูแลระบบ</span>
                                </li>
                                <li>
                                    <a
                                        id="admin_name"
                                        className="text-lg md:text-sm"
                                    >
                                        <i className="fas fa-user-cog"></i>{' '}
                                        ชื่อแอดมิน: {auth.user.name}
                                    </a>
                                </li>
                                {/* <!-- <li><a><i className="fas fa-cog"></i> ตั้งค่าระบบ</a></li> --> */}

                                <li>
                                    <Link
                                        href={'/logout'}
                                        method="post"
                                        as="button"
                                        className="text-lg text-error md:text-sm"
                                    >
                                        <i className="fas fa-sign-out-alt"></i>{' '}
                                        ออกจากระบบ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-[0.6rem] text-[0.8rem] md:mt-[0.4rem] md:text-[1rem]">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
