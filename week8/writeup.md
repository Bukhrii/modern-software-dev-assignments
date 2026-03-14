# Week 8 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## Instructions

Fill out all of the `TODO`s in this file.

## Submission Details

Name: **TODO** \
SUNet ID: **TODO** \
Citations: **TODO**

This assignment took me about **TODO** hours to do. 


## App Concept 
```
Aplikasi ini adalah "Shared Task Board", sebuah pengelola tugas publik bergaya Kanban/List. Aplikasi ini secara ketat tidak menggunakan autentikasi (tanpa login/register). Pengguna dapat langsung mengakses dasbor utama dan melakukan operasi CRUD (Create, Read, Update, Delete) pada entitas Tugas (Task). Data disimpan secara persisten di database sehingga setiap perubahan sinkron dan dapat dilihat oleh pengguna lain. Aplikasi dilengkapi dengan validasi input dasar (judul wajib diisi) dan penanganan error antarmuka.
```


## Version #1 Description
```
APP DETAILS:
===============
Folder name: TODO
AI app generation platform: TODO
Tech Stack: TODO
Persistence: TODO
Frameworks/Libraries Used: TODO
(Optional but recommended) Screenshots of core flows: TODO

REFLECTIONS:
===============
Folder name: versi_1
AI app generation platform: bolt.new
Tech Stack: Vite, React, TypeScript, Node.js
Persistence: PostgreSQL (melalui Supabase) menggunakan Prisma ORM
Frameworks/Libraries Used: React, Tailwind CSS, Prisma Client, Vite
(Optional but recommended) Screenshots of core flows: [SISIPKAN NAMA FILE GAMBAR SCREENSHOT ANDA DI SINI JIKA ADA]

REFLECTIONS:
===============
a. Issues encountered per stack and how you resolved them: 
- Error "ENOENT package.json" saat menjalankan npm install pertama kali karena hasil export dari Bolt.new menyimpan kode di dalam sub-folder tambahan. Resolusi: Menjalankan navigasi direktori (`cd project/`) ke lokasi yang benar.
- Layar putih (blank screen) dan error koneksi saat menjalankan web di lokal. Resolusi: Mengatur file `.env` manual dengan kredensial Supabase (DATABASE_URL, VITE_SUPABASE_URL, ANON_KEY) dan melakukan sinkronisasi tabel dengan menjalankan `npx prisma db push`.
- Error SQL terkait relasi `auth.users` saat mencoba menggunakan fitur login yang digenerate AI. Resolusi: Mengubah konsep aplikasi menjadi tanpa autentikasi agar mematuhi syarat fungsionalitas minimum tanpa terjebak bug konfigurasi internal Supabase.

b. Prompting (e.g. what required additional guidance; what worked poorly/well): 
Prompting awal yang meminta fitur autentikasi admin bekerja dengan buruk (worked poorly) karena Bolt.new dan Supabase menangani enkripsi password di skema terpisah, menyebabkan error "column password does not exist" saat AI mencoba melakukan seed data manual. 
Menginstruksikan AI dengan prompt yang secara eksplisit menyatakan "strictly NO authentication, NO login, and NO registration" bekerja sangat baik (worked well) dan menghasilkan kode yang langsung bisa berjalan setelah environment diatur.

c. Approximate time-to-first-run and time-to-feature metrics: 
- Time-to-first-run: ~45 menit (termasuk waktu debugging struktur folder dan setup Supabase manual).
- Time-to-feature: ~5 menit (setelah prompt diubah menjadi tanpa autentikasi, fitur CRUD langsung berfungsi 100% tanpa revisi kode).
```

## Version #2 Description
```
APP DETAILS:
===============
Folder name: TODO
AI app generation platform: TODO
Tech Stack: TODO
Persistence: TODO
Frameworks/Libraries Used: TODO
(Optional but recommended) Screenshots of core flows: TODO

REFLECTIONS:
===============
a. Issues encountered per stack and how you resolved them: TODO

b. Prompting (e.g. what required additional guidance; what worked poorly/wel): TODO

c. Approximate time-to-first-run and time-to-feature metrics: TODO
```

## Version #3 Description
```
APP DETAILS:
===============
Folder name: TODO
AI app generation platform: TODO
Tech Stack: TODO
Persistence: TODO
Frameworks/Libraries Used: TODO
(Optional but recommended) Screenshots of core flows: TODO

REFLECTIONS:
===============
a. Issues encountered per stack and how you resolved them: TODO

b. Prompting (e.g. what required additional guidance; what worked poorly/wel): TODO

c. Approximate time-to-first-run and time-to-feature metrics: TODO
```
