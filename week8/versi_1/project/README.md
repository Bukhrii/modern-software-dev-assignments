# Version 1: Shared Task Board (Bolt.new)

Aplikasi ini adalah pengelola tugas bersama (Shared Task Board) yang di-generate menggunakan platform AI bolt.new. Aplikasi ini memungkinkan operasi CRUD penuh pada entitas Tugas (Task) tanpa memerlukan registrasi atau login.

## Prerequisites
- Node.js (disarankan versi 18 atau lebih baru)
- npm (Node Package Manager)
- Akun Supabase (untuk database PostgreSQL)

## Environment Configuration
Aplikasi ini membutuhkan koneksi ke database Supabase. Buat file bernama `.env` di root direktori proyek ini (sejajar dengan `package.json`) dan isi dengan kredensial proyek Supabase Anda:

\`\`\`env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
VITE_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
\`\`\`

## Installation & Set-up Instructions
1. Buka terminal dan pastikan Anda berada di direktori yang tepat (direktori yang berisi file `package.json`). Jika hasil *export* dari Bolt memiliki sub-folder (seperti `project/`), masuk ke folder tersebut terlebih dahulu.
2. Instal semua dependensi:
   \`\`\`bash
   npm install
   \`\`\`
3. Sinkronkan skema database Prisma ke Supabase Anda untuk membuat tabel yang diperlukan:
   \`\`\`bash
   npx prisma db push
   \`\`\`

## Run the Application
Mulai server pengembangan lokal dengan perintah:
\`\`\`bash
npm run dev
\`\`\`
Aplikasi dapat diakses melalui browser pada `http://localhost:5174/`.

## Deviations, Known Issues, and Manual Fixes
- **Struktur Folder Export:** Saat mengunduh dari Bolt.new, kode dibungkus dalam sub-folder `project/`. Menjalankan `npm install` di luar folder ini menghasilkan error `ENOENT package.json`. **Fix:** Navigasi manual (`cd project/`) diperlukan sebelum instalasi.
- **Layar Kosong (Blank Screen) saat Inisialisasi:** Aplikasi awalnya gagal merender UI dan hanya menampilkan layar putih. **Fix:** Ini disebabkan oleh absennya file `.env` dan tabel database yang belum disinkronkan. Mengonfigurasi variabel environment Supabase secara manual dan menjalankan `npx prisma db push` memperbaiki masalah ini.
- **Penyederhanaan Konsep:** Fitur autentikasi (login/register) dihapus dari konsep awal (Gym Management) menjadi Shared Task Board terbuka untuk menghindari error relasi SQL internal Supabase (`auth.users`) yang gagal dikonfigurasi secara otomatis oleh AI generator.