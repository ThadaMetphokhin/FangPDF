import ThemeToggle from '../ThemeToggle';

export default function HeaderComponent() {
    return (
        <>
            <header className="fixed z-2 w-full">
                <div className="drawer">
                    <input
                        id="my-drawer-2"
                        type="checkbox"
                        className="drawer-toggle"
                    />

                    <div className="drawer-content flex flex-col">
                        {/* <!-- Navbar --> */}
                        <div className="navbar w-full bg-[#800000] py-3">
                            <div className="order-last flex-none lg:hidden">
                                <label
                                    htmlFor="my-drawer-2"
                                    aria-label="open sidebar"
                                    className="btn btn-square btn-ghost"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block h-6 w-6 stroke-current"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        ></path>
                                    </svg>
                                </label>
                            </div>
                            <div className="mx-10 flex flex-2 px-1 md:mx-38">
                                <div className="mb-1 flex h-17 w-17 items-center justify-center rounded-full shadow-md">
                                    {/* <!-- <i className="fas fa-graduation-cap text-white text-2xl"></i> --> */}
                                    <img
                                        src="/images/logoFang.png"
                                        alt="logo"
                                    />
                                </div>
                                <div className="xs:none flex items-center justify-center">
                                    <h5 className="mx-1 my-auto">
                                        <span className="block text-base font-semibold text-white md:text-lg">
                                            วิทยาลัยการอาชีพฝาง
                                        </span>

                                        <p className="-mt-1 hidden text-[0.7rem] font-normal tracking-[0.2px] text-[#E5C100] md:-mt-2 md:block md:text-[0.85rem] md:tracking-[0.5px]">
                                            Fang Industrial and Community
                                            Education College
                                        </p>
                                    </h5>
                                </div>
                            </div>
                            <div className="hidden flex-none lg:block">
                                <div className="menu menu-horizontal gap-10 text-[1rem] font-light text-white">
                                    {/* <!-- Navbar menu content here --> */}
                                    <a
                                        href="https://www.fve.ac.th/"
                                        className="inline-block transition-all duration-300 hover:-translate-y-1 hover:cursor-pointer hover:text-[#E5C100] hover:brightness-125 hover:drop-shadow-[0_0_5px_#E5C100]"
                                    >
                                        หน้าแรก
                                    </a>
                                    <a
                                        href="https://www.fve.ac.th/contact"
                                        className="inline-block transition-all duration-300 hover:-translate-y-1 hover:cursor-pointer hover:text-[#E5C100] hover:brightness-125 hover:drop-shadow-[0_0_5px_#E5C100]"
                                    >
                                        ติดต่อเรา
                                    </a>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="drawer-side">
                        <label
                            htmlFor="my-drawer-2"
                            aria-label="close sidebar"
                            className="drawer-overlay"
                        ></label>
                        <ul className="menu min-h-full w-50 bg-base-200 p-4">
                            {/* <!-- Sidebar content here --> */}
                            <div className="mb-1">เมนู</div>
                            <li>
                                <span>
                                    <i className="fa-solid fa-house"></i>
                                    <a href="https://www.fve.ac.th/">หน้าแรก</a>
                                </span>
                            </li>
                            <li>
                                <span>
                                    <i className="fa-solid fa-address-book"></i>
                                    <a href="https://www.fve.ac.th/contact">
                                        ติดต่อเรา
                                    </a>
                                </span>
                            </li>

                            <div className='mt-5  border-t w-full'>
                                {' '}
                                <span className='flex justify-center gap-2 pt-5'>
                                    <p>เปลี่ยนธีม</p>
                                    <ThemeToggle />
                                </span>
                            </div>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    );
}
