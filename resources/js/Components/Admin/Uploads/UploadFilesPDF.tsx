import { usePage, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2'; // แนะนำให้ใช้สำหรับแจ้งเตือน
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://unpkg.com/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs';
export default function UploadFilesPDFComponent() {
    const { ListFiles } = usePage().props as any;
    const categories = ListFiles?.categoryFile || [];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isReadingFile, setIsReadingFile] = useState(false);

    //State for upload type Chunk upload
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // ตั้งค่า useForm
    const { data, setData, post, processing, reset, errors } = useForm({
        default_name: '',
        name_file: '',
        category_file: '',
        comment_file: '',
        count_page: 0,
        size_file: '',
        file_PDF: null as File | null,
    });

    // ฟังก์ชันจัดการไฟล์
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                //Swal.fire('ผิดพลาด', 'กรุณาเลือกไฟล์ PDF เท่านั้น', 'error');
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: 'กรุณาเลือกไฟล์ PDF เท่านั้น',
                    //footer: '<a href="#">Why do I have this issue?</a>',
                });
                return;
            }

            setIsReadingFile(true);
            const fileSize = (selectedFile.size / (1024 * 1024)).toFixed(2);
            const fileName = selectedFile.name.replace('.pdf', '');
            //count page
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const result = e.target?.result;

                    if (result && result instanceof ArrayBuffer) {
                        const typedarray = new Uint8Array(result);

                        //Load PDF files
                        const pdf =
                            await pdfjsLib.getDocument(typedarray).promise;

                        //Pull Count Page
                        const numPages = pdf.numPages;
                        // ถ้ายังไม่มีชื่อไฟล์ ให้ดึงชื่อจากไฟล์ที่อัพโหลดมาใส่ให้ก่อน
                        // *** อัปเดตข้อมูลทั้งหมดพร้อมกันที่นี่ ***
                        setData({
                            ...data,
                            file_PDF: selectedFile,
                            size_file: fileSize,
                            count_page: numPages,
                            name_file: data.name_file || fileName,
                            default_name: data.name_file || fileName,
                        });
                    }
                } catch (e) {
                    console.error('Error reading PDF', e);
                } finally {
                    setIsReadingFile(false);
                }
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    // ฟังก์ชันส่งข้อมูล
    const updatePDF = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.file_PDF) {
            //Swal.fire('แจ้งเตือน', 'กรุณาเลือกไฟล์ก่อนอัพโหลด', 'warning');
            Swal.fire({
                title: 'แจ้งเตือน',
                icon: 'info',
                text: 'กรุณาเลือกไฟล์ก่อนอัพโหลด',
            });
            return;
        }
        setIsUploading(true);
        const file = data.file_PDF;
        const chunkSize = 10 * 1024 * 1024; // ขนาดชิ้นละ 10 MB
        const totalChunks = Math.ceil(file.size / chunkSize);
        const uploadId = crypto.randomUUID(); // ไอดีอ้างอิงสำหรับรวมไฟล์ที่ Server

        try {
            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);
                const formData = new FormData();
                // --- ข้อมูลไฟล์สำหรับการ Chunk ---
                formData.append('file_chunk', chunk);
                formData.append('chunk_index', i.toString());
                formData.append('total_chunks', totalChunks.toString());
                formData.append('upload_id', uploadId);

                // --- ข้อมูล Metadata ตาม Laravel Validation  ---
                formData.append('default_name', data.default_name || '');
                formData.append('name_file', data.name_file || '');
                formData.append('category_file', data.category_file || '');
                formData.append('comment_file', data.comment_file || '');
                formData.append(
                    'count_page',
                    (data.count_page || 0).toString(),
                );
                formData.append(
                    'size_file',
                    (data.size_file || '0').toString(),
                );

                // หมายเหตุ: ในฝั่ง Laravel คุณต้องเช็คว่าถ้าเป็น Chunk สุดท้าย
                // ค่อยทำการ Validate ไฟล์จริง หรือ Validate ข้อมูล Text ตั้งแต่ Chunk แรก

                await axios.post('/Admin/Uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        //  เช็คว่ามีค่า total หรือไม่
                        if (progressEvent.total) {
                            const currentChunkProgress =
                                progressEvent.loaded / progressEvent.total;
                            // คำนวณเปอร์เซ็นต์รวม (i คือลำดับของ Chunk ปัจจุบัน)
                            const totalProgress = Math.round(
                                ((i + currentChunkProgress) / totalChunks) *
                                    100,
                            );
                            setUploadProgress(totalProgress);
                        } else {
                            //  กรณีที่ total เป็น undefined ให้ประมาณการจากจำนวน Chunk แทน
                            const totalProgress = Math.round(
                                (i / totalChunks) * 100,
                            );
                            setUploadProgress(totalProgress);
                        }
                    },
                });
            }
            // Swal.fire('สำเร็จ', 'อัพโหลดไฟล์เรียบร้อยแล้ว', 'success');
            Swal.fire({
                title: 'สำเร็จ',
                icon: 'success',
                text: 'อัพโหลดไฟล์เรียบร้อยแล้ว',
            });
            reset();
            setUploadProgress(0);
        } catch (error: any) {
            console.error(error);
            const errorMsg =
                error.response?.data?.message || 'ไม่สามารถอัพโหลดไฟล์ได้';
            setIsUploading(false);
            //Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัพโหลดไฟล์ได้', 'error');
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                icon: 'error',
                text: errorMsg,
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form
            onSubmit={updatePDF}
            className="rounded-xl bg-white p-6 shadow-lg dark:bg-[#2B2A2A] dark:text-white"
        >
            <h2 className="mb-6 text-xl font-bold">อัพโหลดไฟล์ใหม่</h2>

            {/* Area สำหรับคลิกอัพโหลด */}
            <div
                className={`upload-area mb-6 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:cursor-pointer ${data.file_PDF ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary'}`}
                onClick={() => !isReadingFile && fileInputRef.current?.click()}
            >
                {isReadingFile ? (
                    <>
                        <div className="flex flex-col items-center">
                            <span className="loading mb-4 loading-lg loading-spinner text-blue-500"></span>
                            <p className="font-medium text-blue-600">
                                กำลังวิเคราะห์ไฟล์ PDF...
                            </p>
                            <p className="text-xs text-blue-400">
                                กรุณารอสักครู่
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <i
                            className={`fas ${data.file_PDF ? 'fa-file-pdf text-green-500' : 'fa-cloud-upload-alt text-gray-400'} mb-4 text-4xl`}
                        ></i>
                        <p className="mb-2 font-medium">
                            {data.file_PDF
                                ? `เลือกไฟล์แล้ว: ${data.file_PDF.name}`
                                : 'ลากไฟล์มาวางที่นี่'}
                        </p>
                        <p className="mb-4 text-sm text-gray-500">
                            {data.file_PDF
                                ? `ขนาด ${(data.file_PDF.size / (1024 * 1024)).toFixed(2)} MB`
                                : 'หรือคลิกเพื่อเลือกไฟล์'}
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileSelect}
                        />
                    </>
                )}
                {errors.file_PDF && (
                    <span className="mt-1 text-xs text-error">
                        {errors.file_PDF}
                    </span>
                )}
            </div>

            <div className="form-control mb-4">
                <label className="label">
                    <span className="label-text font-medium">ชื่อไฟล์</span>
                </label>
                <input
                    type="text"
                    placeholder="ระบุชื่อไฟล์..."
                    className={`input-bordered input w-full dark:bg-[#44444E] ${errors.name_file ? 'input-error' : ''}`}
                    value={data.name_file}
                    onChange={(e) => setData('name_file', e.target.value)}
                />
                {errors.name_file && (
                    <span className="mt-1 text-xs text-error">
                        {errors.name_file}
                    </span>
                )}
            </div>

            <div className="form-control mb-4">
                <label className="label">
                    <span className="label-text font-medium">หมวดหมู่</span>
                </label>
                <select
                    className={`select-bordered select w-full dark:bg-[#44444E] ${errors.category_file ? 'select-error' : ''}`}
                    value={data.category_file}
                    onChange={(e) => setData('category_file', e.target.value)}
                >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.category_file && (
                    <span className="mt-1 text-xs text-error">
                        {errors.category_file}
                    </span>
                )}
            </div>

            <div className="form-control mb-6">
                <label className="label">
                    <span className="label-text font-medium">คำอธิบาย</span>
                </label>
                <textarea
                    className="textarea-bordered textarea h-24 w-full dark:bg-[#44444E]"
                    placeholder="คำอธิบายไฟล์..."
                    value={data.comment_file}
                    onChange={(e) => setData('comment_file', e.target.value)}
                ></textarea>
                {errors.comment_file && (
                    <span className="mt-1 text-xs text-error">
                        {errors.comment_file}
                    </span>
                )}
            </div>
            {isUploading && (
                <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
                    <div
                        className="h-2.5 rounded-full bg-red-600 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="mt-1 text-center text-xs text-gray-500">
                        {uploadProgress}%
                    </p>
                </div>
            )}
            <button
                type="submit"
                className={`btn w-full border-none bg-[#C3110C] text-[#E5C100] hover:bg-[#F63049] ${isUploading || processing ? 'loading' : ''}`}
                disabled={isUploading || processing}
            >
                {!processing && <i className="fas fa-upload mr-2"></i>}
                {isUploading ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์'}
            </button>
        </form>
    );
}
