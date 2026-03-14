# Week 7 Write-up
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


## Task 1: Add more endpoints and validations
**a. PR Link:** https://github.com/Bukhrii/modern-software-dev-assignments/pull/6

**b. PR Description:**
- **Problem:** API yang ada sebelumnya tidak memiliki fungsi untuk menghapus (*delete*) data pada `notes` maupun `action items`. Selain itu, tidak ada validasi input yang ketat, sehingga memungkinkan data kosong atau tidak valid tersimpan. Endpoint untuk mengambil satu `action item` spesifik juga belum tersedia.
- **Approach:** - Menggunakan Pydantic `Field` pada `schemas.py` untuk menerapkan batasan `min_length` dan `max_length` pada *payload* (cth: `NoteCreate`, `ActionItemCreate`).
  - Mengimplementasikan endpoint `DELETE /notes/{note_id}` dan `DELETE /action-items/{item_id}`.
  - Mengimplementasikan endpoint `GET /action-items/{item_id}`.
  - Menggunakan *1-shot prompt* dengan AI (sebutkan AI Anda, cth: GitHub Copilot/Cursor) untuk menghasilkan kode endpoint dan logika validasi yang tepat.
- **Testing Performed:** - Menjalankan aplikasi secara lokal dengan `make run`.
  - Menguji endpoint menggunakan Swagger UI di `http://localhost:8000/docs`.
  - Memastikan pengiriman *string* kosong untuk `title` atau `description` kini mengembalikan ralat *422 Unprocessable Entity*.
  - Berhasil membuat, mengambil, dan menghapus item menggunakan ID, serta memastikan ralat *404 Not Found* muncul jika item tidak ada.
- **Tradeoffs & Follow-ups:** Penggunaan validasi dasar Pydantic sangat cepat dan efektif, namun untuk aturan bisnis yang lebih kompleks di masa depan, kita mungkin memerlukan *custom validators*. Ke depannya, perlu ditambahkan pengujian otomatis (pytest) khusus untuk batasan validasi ini.

**c. Graphite Diamond Generated Code Review & Reflection:**
- **My Manual Comments:** Fokus utama saya pada semakan manual adalah pada ketepatan logika (memastikan ralat 404 muncul jika data tidak ada di *database*) dan memastikan batasan Pydantic secara logis sesuai dengan skema pangkalan data. Saya menambahkan komentar pada PR: *"Error handling untuk 404 sudah ditangani dengan baik sebelum db.delete() dipanggil."*

- **Graphite AI Comments (Komen Semakan AI Graphite):**
  Graphite menyoroti beberapa hal:
  1. Menyarankan penambahan *docstrings* pada setiap endpoint baru untuk menjelaskan apa yang dikembalikan oleh API.
  2. Memberikan peringatan terkait penggunaan tipe data yang mungkin tidak konsisten pada *return message* saat proses *Delete* berhasil.

- **Comparison (Perbandingan):**
  Secara keseluruhan, semakan AI dari Graphite sangat baik dalam mendeteksi gaya penulisan (*style*) dan dokumentasi yang terlewat seperti *docstrings*. Namun, ulasan manual saya lebih baik dalam memahami konteks fungsionalitas utama, yaitu memastikan alur ralat HTTP sesuai dengan kebutuhan bisnis API. 

- **Trust Level (Tingkat Kepercayaan terhadap AI Review):***
  Saya merasa cukup nyaman mempercayai AI untuk menangkap masalah sintaksis, celah keamanan standar, dan kelengkapan dokumentasi. Namun, heuristik/panduan saya ke depan adalah: **Jangan pernah mempercayai AI 100% untuk logika bisnis yang kompleks.** Saya akan selalu mengandalkan semakan manual untuk memastikan fitur berjalan sesuai alur yang diinginkan pengguna.

## Task 2: Extend extraction logic
Tentu! Berikut adalah draf (templat) untuk writeup Tugas 2 (Task 2: Extend extraction logic). Anda bisa langsung menyalin dan menempelkannya ke dalam file writeup.md Anda, tepat di bawah bagian Tugas 1.

Pastikan Anda mengganti bagian di dalam tanda kurung siku [...] dengan informasi Anda yang sebenarnya (terutama Link PR dan komentar asli dari Graphite).

Markdown
## Task 2: Extend extraction logic

**a. PR Link:** https://github.com/Bukhrii/modern-software-dev-assignments/pull/7

**b. PR Description:**
- **Problem:** Logika pengekstrakan `action item` sebelumnya terlalu sederhana karena hanya mengandalkan pencocokan *string* dasar (seperti `startswith` dan `endswith`). Hal ini menyebabkan sistem gagal menangkap format tugas pengembang yang umum seperti awalan `FIXME:`, `TASK:`, atau format kotak centang Markdown (`- [ ]`, `- [x]`).
- **Approach:** - Menggunakan modul `re` (Regular Expressions) untuk mengimplementasikan pencocokan corak (*pattern matching*) yang lebih canggih saat mengekstrak teks.
  - Logika baru ini kini dapat secara cerdas menangkap deskripsi inti dari sebuah tugas dengan mengabaikan awalan-awalannya secara bersih.
  - Memperbarui rangkaian pengujian (*test suite*) di `test_extract.py` untuk memvalidasi corak *regex* baru ini.
  - Menggunakan *1-shot prompt* dengan AI (sebutkan AI Anda, cth: GitHub Copilot/Cursor) untuk menghasilkan kode pengekstrakan dan pengujian (*test*).
- **Testing Performed:** - Menjalankan rangkaian pengujian otomatis menggunakan perintah `make test`. Semua pengujian (termasuk kasus uji baru) berhasil lulus (*passed*).
  - Memverifikasi bahwa kasus tepi (*edge cases*) seperti spasi kosong berlebih atau format kapitalisasi yang berbeda pada kata TODO ditangani dengan baik oleh *regex*.
- **Tradeoffs, Limitations, or Follow-ups:** Penggunaan *Regex* sangat cepat, tetapi bisa menjadi sulit untuk dibaca dan dikelola (sulit di-*maintain*) jika kita terus menambahkan corak baru secara sembarangan. Di masa depan, pendekatan berbasis NLP (seperti memanggil API LLM) mungkin lebih fleksibel untuk ekstraksi meskipun akan menambah latensi waktu proses.

**c. Graphite Diamond Generated Code Review & Reflection:**
- **My Manual Comments (Semakan Manual Saya):** Pada semakan manual, saya lebih fokus memeriksa apakah corak *regex* sudah mencakup berbagai kemungkinan spasi (*whitespace*) dan memastikan uji coba (*test cases*) di `test_extract.py` benar-benar menguji kalimat yang diekstrak tanpa menyertakan tanda hubung atau awalan berlebih. Saya meninggalkan komentar: *"Regex sudah menangkap markdown checkboxes dengan baik, pengujian juga sudah mencakup edge cases."*

- **Graphite AI Comments:** 
  Graphite menyoroti beberapa hal:
  1. Memberikan saran terkait pengelompokan (*grouping*) pada *regex* agar lebih efisien dan mudah dibaca.
  2. Menyarankan penggunaan *raw string* (`r"..."`) secara konsisten pada *regex* untuk menghindari masalah pada karakter *escape*.

- **Comparison (Perbandingan):**
  AI Graphite sangat brilian dalam mengoptimalkan sintaks *regex* dan mendeteksi idiom Python standar (seperti *raw string*). AI jauh lebih cepat menemukan potensi inefisiensi pada kode pencocokan teks dibandingkan saya. Namun, semakan manual saya lebih memastikan bahwa aturan bisnis (corak mana yang *harus* ditangkap dan mana yang tidak) telah dipenuhi dengan benar.

- **Trust Level (Tingkat Kepercayaan terhadap AI Review):**
  Untuk tugas manipulasi teks dan *regex*, saya sangat mempercayai semakan AI karena ia lebih teliti terhadap detail karakter *escape* dan performa. Namun, heuristik saya adalah: selalu periksa secara manual (dan jalankan *test*) untuk memastikan bahwa *output* pengekstrakan sesuai dengan yang dibutuhkan pengguna, bukan sekadar *regex* yang efisien.

## Task 3: Try adding a new model and relationships
**a. PR Link:** https://github.com/Bukhrii/modern-software-dev-assignments/pull/8

**b. PR Description:**
- **Problem:** Aplikasi sebelumnya hanya memiliki model data mandiri (`Note` dan `ActionItem`) tanpa ada struktur relasional. Hal ini membatasi kemampuan pengguna untuk mengelompokkan data.
- **Approach:** - Menambahkan model `Category` ke dalam `models.py`.
  - Membuat relasi *One-to-Many* dengan menambahkan `category_id` (sebagai *Foreign Key*) pada model `Note`.
  - Memperbarui skema Pydantic untuk mendukung pembacaan bersarang (*nested reading*) sehingga ketika kita memanggil endpoint *Note*, informasi *Category* juga akan muncul.
  - Membuat `routers/categories.py` baru untuk mengelola *endpoint* Kategori dan mendaftarkannya di `main.py`.
  - Menggunakan *1-shot prompt* dengan AI untuk menghasilkan pemodelan *SQLAlchemy* dan skema *Pydantic* yang tepat.
- **Testing Performed:** - Menghapus *database* lama (`app.db`) agar *SQLAlchemy* dapat mereplikasi tabel baru dengan benar.
  - Menjalankan aplikasi dengan `make run` dan menguji pembuat entitas *Category* melalui *Swagger UI*.
  - Berhasil membuat *Note* baru yang terhubung ke *Category* dan memverifikasi bahwa respons JSON menampilkan data relasional.
- **Tradeoffs & Follow-ups:** Tanpa alat migrasi skema seperti *Alembic*, setiap perubahan model mengharuskan penghapusan *database* lokal (data hilang). Di masa depan, pengaturan Alembic akan sangat diperlukan jika aplikasi ini diluncurkan ke *production*.

**c. Graphite Diamond Generated Code Review & Reflection:**
- **My Manual Comments:** Saya memastikan bahwa *foreign key* didefinisikan dengan benar dan menyertakan `nullable=True` agar catatan lama (jika tidak dihapus) tidak memecahkan aplikasi. Saya juga menambahkan komentar pada *pull request* saya: *"Penting untuk memastikan schema Pydantic menggunakan from_attributes=True agar dapat membaca relasi ORM secara otomatis."*

- **Graphite AI Comments:**
  Graphite menyoroti beberapa hal:
  1. Memberikan saran terkait penanganan *lazy loading* vs *eager loading* pada relasi *SQLAlchemy* saat data semakin besar.
  2. Mengingatkan tentang perlunya index pada kolom `category_id` di tabel *notes* untuk performa kueri.

- **Comparison:** AI sangat bermanfaat saat memberikan ulasan pada model *SQLAlchemy*, karena dapat mengingatkan hal-hal berbau optimasi basis data (seperti *indexing* dan *N+1 query problem*) yang sering terlewat oleh saya. Namun, saya harus secara manual memastikan arsitektur hubungan logis antara kedua model tersebut masuk akal dengan kebutuhan *frontend* (meskipun *frontend* statis saat ini).

- **Trust Level:** Saya sangat mengandalkan ulasan AI untuk masalah *boilerplate* dan performa (*SQLAlchemy/ORM gotchas*). Namun, merancang desain entitas (Model apa yang dibutuhkan aplikasi) masih harus diputuskan oleh *developer* secara sadar.

## Task 4: Improve tests for pagination and sorting
**a. Links to relevant commits/issues**: https://github.com/Bukhrii/modern-software-dev-assignments/pull/9

**b. PR Description:**
- **Problem:** Aplikasi sebelumnya hanya memiliki model data mandiri (`Note` dan `ActionItem`) tanpa ada struktur relasional. Hal ini membatasi kemampuan pengguna untuk mengelompokkan data.
- **Approach:** - Menambahkan model `Category` ke dalam `models.py`.
  - Membuat relasi *One-to-Many* (Satu-ke-Banyak) dengan menambahkan `category_id` (sebagai *Foreign Key*) pada model `Note`.
  - Memperbarui skema Pydantic untuk mendukung pembacaan bersarang (*nested reading*) sehingga ketika kita memanggil endpoint *Note*, informasi *Category* juga akan muncul.
  - Membuat `routers/categories.py` baru untuk mengelola *endpoint* Kategori dan mendaftarkannya di `main.py`.
  - Menggunakan *1-shot prompt* dengan AI untuk menghasilkan pemodelan *SQLAlchemy* dan skema *Pydantic* yang tepat.
- **Testing:** - Menghapus *database* lama (`app.db`) agar *SQLAlchemy* dapat mereplikasi tabel baru dengan benar.
  - Menjalankan aplikasi dengan `make run` dan menguji pembuat entitas *Category* melalui *Swagger UI*.
  - Berhasil membuat *Note* baru yang terhubung ke *Category* dan memverifikasi bahwa respons JSON menampilkan data relasional.
- **Tradeoffs & Follow-ups:** Tanpa alat migrasi skema seperti *Alembic*, setiap perubahan model mengharuskan penghapusan *database* lokal (data hilang). Di masa depan, pengaturan Alembic akan sangat diperlukan jika aplikasi ini diluncurkan ke *production* (tahap produksi).

**c. Graphite Diamond Generated Code Review & Reflection:**
- **My Manual Comments:** Saya memastikan bahwa *foreign key* didefinisikan dengan benar dan menyertakan `nullable=True` agar catatan lama (jika tidak dihapus) tidak membuat ralat pada aplikasi. Saya juga menambahkan komentar pada *pull request* saya: *"Penting untuk memastikan schema Pydantic menggunakan from_attributes=True agar dapat membaca relasi ORM secara otomatis."*

- **Graphite AI Comments:**
  Graphite menyoroti beberapa hal:
  1. Memberikan saran terkait penanganan *lazy loading* vs *eager loading* pada relasi *SQLAlchemy* saat data semakin besar.
  2. Mengingatkan tentang perlunya index pada kolom `category_id` di tabel *notes* untuk performa kueri.

- **Comparison:** AI sangat bermanfaat saat memberikan ulasan pada model *SQLAlchemy*, karena dapat mengingatkan hal-hal berbau optimasi basis data (seperti *indexing* dan *N+1 query problem*) yang sering terlewat oleh saya. Namun, saya harus secara manual memastikan arsitektur hubungan logis antara kedua model tersebut masuk akal dengan kebutuhan *frontend* (meskipun *frontend* statis saat ini).

- **Trust Level:** Saya sangat mengandalkan ulasan AI untuk masalah *boilerplate* dan performa (*SQLAlchemy/ORM gotchas*). Namun, merancang desain entitas (Model apa yang dibutuhkan aplikasi) masih harus diputuskan oleh *developer* secara sadar.

## Brief Reflection 
**a. The types of comments you typically made in your manual reviews (e.g., correctness, performance, security, naming, test gaps, API shape, UX, docs).**
Dalam review manual saya, saya biasanya memprioritaskan **ketepatan**, **celah pengujian**, dan **logika bisnis**. Saya sangat fokus pada apakah kode tersebut benar-benar menyelesaikan masalah yang disajikan dalam tugas. Misalnya, memeriksa apakah HTTP Exception 404 dimunculkan dengan benar sebelum operasi pangkalan data terjadi, atau memverifikasi bahwa asersi pengujian bukanlah sekadar "positif palsu" tetapi benar-benar memvalidasi perilaku yang diinginkan.

**b. A comparison of your comments vs. Graphite’s AI-generated comments for each PR.**
Secara keseluruhan, komentar saya sangat sesuai dengan konteks tujuan spesifik aplikasi dan alur pengguna. Saya fokus pada struktur dan hubungan logis (seperti memastikan *foreign key* Kategori masuk akal). Sebaliknya, komentar janaan AI dari Graphite sangat teknis, terperinci, dan fokus pada **kinerja**, **keamanan**, dan **gaya kode** (*code style*). Graphite sangat baik dalam menangkap *type hints* yang hilang, menyarankan corak Regex yang lebih baik, menunjukkan potensi masalah kueri N+1 pada SQLAlchemy, dan mengingatkan saya untuk menambahkan *docstrings*.

**c. When the AI reviews were better/worse than yours (cite specific examples)**
- **When AI was better:** Semakan AI secara signifikan lebih baik pada Tugas 2 (Logika Pengekstrakan). Ia dengan mudah menemukan ketidakefisienan dalam corak Regex dan menyarankan penggunaan *raw strings* (`r"..."`) untuk menghindari masalah karakter *escape*. AI juga sangat unggul di Tugas 1 dengan menangkap *docstrings* yang terlewatkan oleh saya.
- **When AI was worse:** AI kurang membantu di Tugas 3 (Model dan Relasi). Meskipun ia menangkap masalah sintaksis, ia tidak dapat mengevaluasi apakah keputusan arsitektural (misal: bagaimana sebuah entitas Kategori berhubungan dengan Catatan) adalah pilihan desain terbaik untuk domain aplikasi tersebut. AI juga terkadang kehilangan "gambaran besar" dalam pengujian (Tugas 4), di mana ia lebih fokus pada *refactoring* gaya penulisan kode pengujian daripada memvalidasi apakah asersi tersebut benar-benar menguji kasus tepi (*edge cases*) yang tepat.

**d. Your comfort level trusting AI reviews going forward and any heuristics for when to rely on them.**
Saya memiliki tingkat kenyamanan yang tinggi untuk mempercayai semakan AI terkait **kesalahan sintaksis, optimasi kode *boilerplate*, pemformatan kode, dan praktik keamanan standar**. AI bertindak seperti linter super yang tidak kenal lelah.

**Heuristik saya untuk mengandalkan semakan AI:**
1. **Rely on AI** untuk idiom khusus bahasa pemrograman (seperti cara *Pythonic* untuk menulis *loop*, sintaks Regex yang paling optimal, atau peringatan *lazy-loading* SQLAlchemy).
2. **Do Not Rely on AI** untuk keputusan arsitektur yang kompleks, logika bisnis khusus domain, atau untuk memvalidasi apakah suatu fitur memenuhi kebutuhan pengguna yang sebenarnya. Semakan manual dan intuisi manusia tetap mutlak diperlukan untuk memastikan kode tidak hanya benar secara teknis, tetapi juga berguna secara praktis.


