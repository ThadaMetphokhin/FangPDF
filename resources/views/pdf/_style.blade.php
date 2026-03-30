<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }



    body {
        font-family: 'thsarabunpsk', sans-serif;
        font-size: 18px;
        padding: 40px;
        color: #000;
    }

    .header {
        text-align: center;
        margin-bottom: 24px;
    }

    .header img {
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
    }

    .header h2 {
        font-size: 16px;
        font-weight: bold;
    }

    /* ตาราง */
    .section {
        width: 100%;
        margin-bottom: 30px;
        page-break-inside: avoid;
        display: block;
        clear: both;
    }

    table {
        width: 100%;
        table-layout: fixed;
        page-break-inside: avoid;
        border-collapse: collapse;
    }

    .section-title {
        text-align: start;
        background-color: #fff;
        border: 1px solid #000;
        padding: 6px 10px;
        font-weight: bold;
        font-size: 18px;
    }

    /* จัดกลางแนวตั้งสำหรับเนื้อหาตาราง */
    /* th,
    td {
        border: 1px solid #000;
        padding: 8px 10px;
        vertical-align: middle;
        
    } */

    th {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
        background-color: #fff;
    }

    td {
        font-size: 18px !important;
        height: 40px;
        border: 1px solid #000;
        padding: 0px 12px;
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
    }

    tr {
        page-break-inside: avoid;
        page-break-after: auto;
    }



    .empty-row td {
        height: 36px;
        /* แถวว่างถ้าไม่มีข้อมูล */
    }

    .namefile {
        text-align: start;
    }




    .signature-container {
        page-break-inside: avoid;
        width: 100%;
        margin-top: 50px;
    }

    .sig-table {
        width: 100%;
        border-collapse: collapse;
        border: none;
        /* ลบขอบตาราง */
    }

    .sig-cell {
        width: 50%;
        text-align: center;
        padding-bottom: 40px;
        padding-left: 60px;
        vertical-align: top;
        border: none;
        /* ลบขอบของเซลล์ */
        line-height: 2;
    }

    /* สร้าง wrapper ครอบข้อความข้างในเพื่อคุมระยะบรรทัด */
    .sig-wrapper {
        /* ให้กว้างเท่าเนื้อหาและจัดกลางตาม text-align ของ td */
        text-align: center;
        width: 100%;
        /* กำหนดความกว้างคงที่เพื่อให้จุดไข่ปลาดูเท่ากันทุกช่อง */
    }

    .sig-line {
        margin-bottom: 5px;
    }

    .sig-name {
        margin-bottom: 5px;
    }

    .sig-title {
        font-weight: normal;
    }

    .page-break {
        page-break-after: always;
    }
</style>