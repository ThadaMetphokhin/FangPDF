

export default function FooterComponent() {
    return (
        <>
            <footer className="custom-border  border-t bg-[#990000] px-6 py-8">
                <div className="container mx-auto">
                    <div className="md:ml-13 flex flex-col justify-between gap-8 px-8 py-8 md:flex-row">
                        {/* <!-- ข้อมูลวิทยาลัย --> */}
                        <div className="md:w-1/2 ">
                            <div className="h-20  w-20 mx-auto mb-5 md:mx-0 ">
                                <img
                                    src="/images/logoFang.png"
                                    alt="logo"
                                />
                            </div>

                            <h3 className="mt-2 mb-4 text-xl font-bold text-[#FFD700]">
                                วิทยาลัยการอาชีพฝาง
                            </h3>
                            <p className="-mt-4 mb-4 text-[0.85rem] font-extralight text-[#FFD700]">
                                Fang Industrial and Community Education College
                            </p>
                            <div className="flex gap-2 justify-center md:justify-start">
                                <a href="https://web.facebook.com/fvefang/?_rdc=1&_rdr#">
                                    <i className="fa-brands fa-facebook rounded-full bg-gray-300/20 p-3 text-sm text-white hover:cursor-pointer hover:bg-[#FFD700] hover:text-[#990000]"></i>
                                </a>
                                <a href="https://www.youtube.com/@ITCENTER_FVE">
                                    <i className="fa-brands fa-youtube rounded-full bg-gray-300/20 p-3 text-sm text-white hover:cursor-pointer hover:bg-[#FFD700] hover:text-[#990000]"></i>
                                </a>
                                <a href="#">
                                    <i className="fa-brands fa-tiktok rounded-full bg-gray-300/20 p-3 text-sm text-white hover:cursor-pointer hover:bg-[#FFD700] hover:text-[#990000]"></i>
                                </a>
                            </div>
                        </div>

                        {/* <!-- เมนูหลัก & นโยบาย --> */}
                        <div className="md:-ml-30 md:w-1/2">
                            <h3 className="text-md mb-4 font-semibold text-[#FFD700]">
                                เมนูหลัก & นโยบาย
                            </h3>
                            <ul className="columns-2 gap-1  space-y-2">
                                <li>
                                    <a
                                        href="https://www.fve.ac.th/news"
                                        className="hover:custom-primary flex items-center text-white transition"
                                    >
                                        หน้าแรก
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.fve.ac.th/news"
                                        className="hover:custom-primary flex items-center text-white transition"
                                    >
                                        ข่าวสาร
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.fve.ac.th/contact"
                                        className="hover:custom-primary flex items-center text-white transition"
                                    >
                                        ติดต่อเรา
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.fve.ac.th/policy"
                                        className="hover:custom-primary flex items-center text-white transition"
                                    >
                                        นโยบายเว็บไซต์
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.fve.ac.th/policy/securityPolicy"
                                        className="hover:custom-primary flex items-center text-white transition"
                                    >
                                        ความปลอดภัย
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.fve.ac.th/policy/privacyPolicy"
                                        className="hover:custom-primary flex items-center text-white transition"
                                    >
                                        ข้อมูลส่วนบุคคล
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2">
                            {/* <!-- ที่อยู่ภาษาไทย --> */}
                            <h3 className="text-md mb-4 font-semibold text-[#FFD700]">
                                ข้อมูลติดต่อ
                            </h3>
                            <div className="mb-4">
                                <p className="flex items-start">
                                    <i className="fas fa-map-marker-alt mt-1 mr-3 text-[#FFD700]"></i>
                                    <span className="text-white">
                                        199 บ้านหนองยาว ตำบลแม่ฮุน อำเภอฝาง
                                        จังหวัดเชียงใหม่, 50110 <br />
                                        199 Ban Nong Yao, Mae Sun Subdistrict,
                                        Fang District, Chiang Mai Province, Mae
                                        Son Mae Sun, Fang District, Chiang Mai
                                        50110
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <!-- ลิขสิทธิ์ --> */}
                    <div className="border-white/25  mt-8 border-t pt-6 text-center">
                        <p className="text-[0.8rem] font-extralight text-white">
                            © 2026 Fang Industrial and Community Education
                            College.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
