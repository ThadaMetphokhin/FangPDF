import { Link, usePage } from '@inertiajs/react';

import ThemeToggle from '../ThemeToggle';

interface User {
    id: number;
    name: string;
}

interface pageProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}

export default function HeaderComponent() {
    const { auth } = usePage<pageProps>().props;
    return (
        <>
            <header className="sticky top-0 z-50">
                <div className="navbar bg-[#800000] shadow-lg">
                    <div className="flex-1">
                        <div className="flex items-center">
                            <div className="mr-4 rounded-lg p-2">
                                <img
                                    className="h-10 w-10"
                                    src="/images/logoFang.png"
                                    alt="logo"
                                />
                            </div>
                            <div>
                                <h1 className="text-[1rem] md:text-xl font-bold text-[#E5C100]">
                                    ระบบจัดการเอกสาร PDF
                                </h1>
                                <p className="hidden md:block text-sm text-[#E5C100]">
                                    Dashboard สำหรับดาวน์โหลดไฟล์เอกสาร
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className=" avatar btn-circle btn-ghost hover:cursor-pointer"
                            >
                                <div className="flex w-10  md:w-10 items-center justify-center rounded-full bg-primary text-white">
                                    <span className="font-bold">
                                        {auth.user.name}
                                    </span>
                                </div>
                            </div>

                            <ul
                                tabIndex={0}
                                className="-mr-20 mt-4 dropdown-content menu z-[1]  font-bold w-100 menu-sm rounded-box bg-base-100 p-5 shadow "
                            >
                                <li>
                                    <a id="user_name" className='text-lg md:text-sm'>
                                        <i className="fas fa-user"></i>ชื่อผู้ใช้งาน: {auth.user.name}
                                    </a>
                                </li>

                                <li>
                                    <Link
                                        className='text-lg text-red-400 md:text-sm'
                                        href={'/logout'}
                                        method="post"
                                        as="button"
                                    >
                                        <i className="fas fa-sign-out-alt"></i>{' '}
                                        ออกจากระบบ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="text-[0.8rem]  mt-[0.6rem] md:text-[1rem] md:mt-[0.4rem]">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
