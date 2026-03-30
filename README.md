
# FangDownloadPDF

บอกที่อยู่ของไฟล์และตำแหน่งโฟลเดอร์สำหรับหน้าบ้าน


## Installation

    1. สร้างโฟลเดอร์ใหม่และเข้าไปยัง Path ของโฟลเดอร์

```bash
  cd ./โฟลเดอร์ของโปรเจค   เช่น -> cd ./FangPDF
```
    2. สร้าง SSH Key generate บนเครื่อง Local เปิด Terminal ของ Vs Code รันคำสั่ง
```bash
  ssh-keygen -t ed25519 -C "your_email@example.com"

  cat ~/.ssh/id_ed25519.pub

  นำ Public Key ไปเพิ่มใน GitHub ให้ไปที่
   1. Setting
   2. SSH and GPG keys
   3. New SSH key
   4. เพิ่ม Key ที่ได้มาจากการสร้างบนเครื่อง Local
      - Title: ตั้งตามใจ
      - Key type: Authentication key
      - Key: วาง Key ที่ได้จากเครื่อง Local
```
3. Clone ไฟล์จาก GitHub repo
```bash
   โฟลเดอร์ของโค้ดที่พ่งสร้างแล้วรันคำสั่ง

   git clone https://github.com/ThadaMetphokhin/FangPDF.git

```
3. ติดตั้ง Library ของ Larvel และ Node
```bash
   composer Install
   npm install
```   
4. ติดตั้ง Library ของ Larvel และ Node

```bash
  cd ./โฟลเดอร์ของโปรเจคเช่น -> cd ./FangPDF

  composer Install
  npm install
```
## โครงสร้างโฟลเดอร์ Front End
```bash
├── resources
│   ├── css
│   ├── js                             # ในโฟลเดอร์ js เป็นส่วนของหน้าบ้าน
│   │   ├── actions
│   │   ├── app.tsx
│   │   ├── Components                 # ส่วนของ UI Components
│   │   ├── Contexts
│   │   ├── lib
│   │   ├── pages                      # ส่วนของหน้าต่าง ๆ
│   │   ├── routes
│   │   ├── ssr.tsx
│   │   ├── types
│   │   └── wayfinder
│   │       └── index.ts
│   └── views
│       ├── app.blade.php
│       └── pdf                         # ส่วนของการพิมพ์ PDF
│           ├── components
│           ├── reportpdf.blade.php
│           └── _style.blade.php
```
## โครงสร้างโฟลเดอร์ Front End ทรัพยากรต่าง ๆ
```bash
├── public
│   ├── apple-touch-icon.png
│   ├── build
│   │   ├── assets
│   │   └── manifest.json
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── fonts
│   │   ├── THSarabun-Bold.ttf
│   │   ├── THSarabunNew-Bold.ttf
│   │   ├── THSarabunNew.ttf
│   │   └── THSarabun.ttf
│   ├── images
│   │   └── logoFang.png
│   ├── index.php
│   └── robots.txt
```
## Tech Stack

**Client:** React, Inertia, DaisyUI, TailwindCss

**Server:** Node, Laravel

