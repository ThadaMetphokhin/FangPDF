import { useState } from 'react';

import { PDFDocument, rgb, RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// --- Types ---
interface SectionRow {
    count: number | string;
    percent: string;
}

interface PdfData {
    section1: SectionRow[]; // ด้านที่ 1 ข้อมูลผู้เรียน
    section2: SectionRow[]; // ด้านที่ 2 ข้อมูลบุคลากร
    section3: SectionRow[]; // ด้านที่ 3 ข้อมูลงบประมาณและทรัพยากร
    section4: SectionRow[]; // ด้านที่ 4 ข้อมูลแผนงาน/ผลการดำเนินการ
}

export function DownloadPdfReport() {
    const [loading, setLoading] = useState(false);

    const downloadPDF = async (): Promise<void> => {
        setLoading(true);
        try {
            //data
            const data:PdfData = await fetch('/Admin/pdf-data')
                    .then((res)=>{
                        if(!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                        return res.json();
                    })
            console.log(data)
            //Load PDF template
            const templatebytes = await fetch('/Admin/pdf-template').then(
                (res) => res.arrayBuffer(),
            );

            //Load fonts thai sarabun new
            const fontbytes = await fetch('/font/THSarabunNew.ttf').then(
                (res) => res.arrayBuffer(),
            );

            //open pdf file
            const pdfDoc = await PDFDocument.load(templatebytes);
            pdfDoc.registerFontkit(fontkit);
            const thaiFont = await pdfDoc.embedFont(fontbytes);

            const page = pdfDoc.getPages()[0];

            // ----------------------------------------------------------------
            // พิกัดจากการวิเคราะห์ PDF จริง (pdf-lib นับ y จากล่างขึ้นบน)
            // Page size: 612 x 792
            // col1X = กึ่งกลางช่องซ้าย  (~120)
            // col2X = กึ่งกลางช่องขวา   (~390)
            // ----------------------------------------------------------------
            const COL1_X    = 120;  // คอลัมน์ซ้าย  (จำนวน / ไฟล์เอกสาร)
            const COL2_X    = 390;  // คอลัมน์ขวา  (คิดเป็นร้อยละ)
            const ROW_H     = 28;   // ความสูงต่อแถว
            const FONT_SIZE = 11;

            // ตำแหน่ง y แถวแรกของข้อมูลแต่ละด้าน
            const SECTION_Y: Record<keyof PdfData, number> = {
                section1: 512,  // ด้านที่ 1
                section2: 379,  // ด้านที่ 2
                section3: 246,  // ด้านที่ 3
                section4: 113,  // ด้านที่ 4
            };

            // วนเขียนข้อมูลทั้ง 4 ด้าน
            (Object.keys(SECTION_Y) as Array<keyof PdfData>).forEach((key) => {
                const rows   = data[key];
                const startY = SECTION_Y[key];

                rows.forEach((row:any, index:any) => {
                    const y = startY - ROW_H * index;

                    page.drawText(String(row.count), {
                        x: COL1_X,
                        y,
                        size: FONT_SIZE,
                        font: thaiFont,
                        color: rgb(0, 0, 0),
                    });

                    page.drawText(row.percent, {
                        x: COL2_X,
                        y,
                        size: FONT_SIZE,
                        font: thaiFont,
                        color: rgb(0, 0, 0),
                    });
                });
            });

            //save and download
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], {
                type: 'application/pdf',
            });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `report_PDF${Date.now()}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err: unknown) {
            console.log(err);
            alert('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF');
        } finally {
            setLoading(false);
        }
    };
    return { downloadPDF, loading };
}
