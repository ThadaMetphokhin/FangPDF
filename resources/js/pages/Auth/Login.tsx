import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import Swal from 'sweetalert2';

import HeaderComponent from '@/Components/Home/Header';
import FooterComponent from '@/Components/Home/Footer';

export default function LoginPage() {
    //Form State Login
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    //State Show password
    const [showPass, setShowPass] = useState(false);
    //State Show Loging
    const [login, setLogin] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        post('/', {
            onError: (err) => {
                //console.log('รายละเอียด Error จาก Server:', err);
                console.log(err);
                if (err.status === '401') {
                    const message = err.message;
                    Swal.fire({
                        icon: 'error',
                        title: '',
                        text: message,
                        //  footer: '<a href="#">Why do I have this issue?</a>',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '',
                        text: err.database,
                        // footer: '<a href="#">Why do I have this issue?</a>',
                    });
                }
            },
            onSuccess: () => {
                Swal.fire({
                    //position: 'top-end',
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำหเร็จ',
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };
    //Function Login
    return (
        <>
            <Head title="เข้าสู่ระบบ - วิทยาลัยการอาชีพฝาง" />
            <HeaderComponent />
            <div className="flex min-h-screen flex-col">
                {/* <!-- Header -->

                {/* <!-- เนื้อหาหลัก --> */}
                <main className="mt-20 flex flex-grow items-center justify-center p-10 dark:bg-[#44444E]">
                    <div className="mt-10 w-full max-w-lg">
                        {/* <!-- หัวข้อ Login --> */}
                        <div className="mb-10 text-center">
                            <h1 className="mb-3 text-3xl font-[1000] text-[#990000] antialiased dark:text-[#D3DAD9]">
                                เข้าสู่ระบบ test  final last
                            </h1>
                            <p className="text-lg dark:text-[#D3DAD9]">
                                สำหรับบุคลากร วิทยาลัยการอาชีพฝาง
                            </p>
                        </div>

                        {/* <!-- ฟอร์ม Login --> */}
                        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-[#2B2A2A]">
                            <form
                                onSubmit={handleLogin}
                                id="loginForm"
                                className="space-y-6"
                            >
                                {/* <!-- Username Field --> */}
                                <div>
                                    <label className="custom-gray mb-2 block font-bold dark:text-white">
                                        <i className="fas fa-user custom-secondary mr-2 dark:text-white"></i>
                                        ชื่อผู้ใช้งาน
                                    </label>
                                    <div className="relative">
                                        {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <i className="fas fa-user custom-gray"></i>
                                        </div> */}
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={data.username}
                                            onChange={(e) =>
                                                setData(
                                                    'username',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="กรุณากรอกชื่อผู้ใช้งาน"
                                            className="w-full border-b-2 border-gray-200 py-3 focus:border-[#990000] focus:outline-none md:pl-12 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* <!-- Password Field --> */}
                                <div>
                                    <label className="custom-gray mb-2 block font-bold dark:text-white">
                                        <i className="fas fa-lock custom-secondary mr-2 dark:text-white"></i>
                                        รหัสผ่าน
                                    </label>
                                    <div className="relative">
                                        {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <i className="fas fa-lock custom-gray"></i>
                                        </div> */}
                                        <input
                                            type={
                                                showPass ? 'text' : 'password'
                                            }
                                            id="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="กรุณากรอกรหัสผ่าน"
                                            className="w-full border-b-2 border-gray-200 py-3 focus:border-[#990000] focus:outline-none md:pl-12 dark:text-white"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-1 md:pr-4">
                                            <button
                                                type="button"
                                                id="togglePassword"
                                                className="custom-gray hover:custom-primary cursor-pointer dark:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(55,55,55)] 
    [&:-webkit-autofill]:[webkit-text-fill-color:#ffffff]"
                                                onClick={() =>
                                                    setShowPass(!showPass)
                                                }
                                            >
                                                {showPass ? (
                                                    <i className="fa-solid fa-eye-slash"></i>
                                                ) : (
                                                    <i
                                                        className="fas fa-eye"
                                                        id="passwordIcon"
                                                    ></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {/* <!-- <div className="flex justify-between items-center mt-2">
                            <label className="cursor-pointer flex items-center">
                                <input type="checkbox" id="remember" className="checkbox checkbox-sm border custom-border" />
                                <span className="label-text custom-gray ml-3 text-sm">จำการเข้าสู่ระบบ</span>
                            </label>
                            <a href="#" className="text-sm font-medium link-secondary">ลืมรหัสผ่าน?</a>
                        </div> --> */}
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing ? true : false}
                                        className={
                                            processing
                                                ? 'btn h-auto w-full rounded-lg bg-gray-200 py-4 text-lg font-medium text-black'
                                                : `btn h-auto w-full rounded-lg bg-[#800000] py-4 text-lg font-medium text-[#E5C100]`
                                        }
                                    >
                                        <i className="fas fa-sign-in-alt mr-3"></i>
                                        {processing
                                            ? 'กำลังเข้าสู่ระบบ...'
                                            : 'เข้าสู่ระบบ'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* <!-- ข้อมูลติดต่อ --> */}
                        <div className="mt-8 mb-10 text-center text-sm dark:text-[#D3DAD9]">
                            <p>
                                หากมีปัญหาการเข้าสู่ระบบ
                                โปรดติดต่อฝ่ายเทคโนโลยีสารสนเทศ
                            </p>
                            <p className="mt-1">
                                <i className="fas fa-phone-alt custom-secondary mr-2"></i>{' '}
                                053-346818
                                <i className="fas fa-envelope custom-secondary mx-4"></i>{' '}
                                Fice_fang@hotmail.com, fang_vec@hotmail.com
                            </p>
                        </div>
                    </div>
                </main>

                {/* <!-- Footer --> */}
                {/* <?php include_once('./Src/Components/Index/Footer.php');?> */}
                <FooterComponent />
                {/* <!-- การแจ้งเตือน --> */}
                <div
                    id="successAlert"
                    className="toast toast-center toast-top hidden"
                >
                    <div className="alert alert-success shadow-lg">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-check-circle"></i>
                            <span>เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...</span>
                        </div>
                    </div>
                </div>

                <div
                    id="errorAlert"
                    className="toast toast-center toast-top hidden"
                >
                    <div className="alert alert-error shadow-lg">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
