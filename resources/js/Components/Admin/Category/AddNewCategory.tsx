import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
export default function AddNewCategoryComponent() {
    const { data, setData, post, reset,processing } = useForm({
        name_cate: '',
    });

    const AddNewCate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/Admin/Category', {
            onSuccess: (page) => {
                const message = (page.props as any).flash.success ||   'ทำรายการสำเร็จ';
                (document.getElementById('edit_modal') as any).close();
                Swal.fire({
                    title: 'สำเร็จ',
                    icon: 'success',
                    text: message,
                });
                reset();
            },
            onError: (err) => {
               //console.error(err);
                //Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัพโหลดไฟล์ได้', 'error');
                (document.getElementById('edit_modal') as any).close();
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    icon: 'error',
                    text: 'ไม่สามารถเพิ่มหมวดหมู่ด้',
                });
            },
        });
    };
    return (
        <>
            <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl bg-white p-6 shadow-lg dark:bg-[#2B2A2A] dark:text-white">
                    <h2
                        className="mb-6 text-xl font-bold"
                        id="categoryPanelTitle"
                    >
                        เพิ่มหมวดหมู่ใหม่
                    </h2>

                    <div id="categoryFormPanel">
                        <form onSubmit={AddNewCate} id="categoryForm">
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        ชื่อหมวดหมู่
                                    </span>
                                    <span className="label-text-alt text-error">
                                        *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="ระบุชื่อหมวดหมู่"
                                    value={data.name_cate}
                                    className="input-bordered input w-full dark:bg-[#44444E]"
                                    id="categoryName"
                                    onChange={(e) =>
                                        setData('name_cate', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing ? true:false}
                                    className={`btn flex-1 ${processing ? 'bg-gray-200':'bg-[#C3110C]'} text-[#E5C100] hover:bg-[#F63049]`}
                                    id="submitCategoryBtn"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
