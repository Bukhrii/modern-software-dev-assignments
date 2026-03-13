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
- **My Manual Comments (Semakan Manual Saya):** Fokus utama saya pada semakan manual adalah pada ketepatan logika (memastikan ralat 404 muncul jika data tidak ada di *database*) dan memastikan batasan Pydantic secara logis sesuai dengan skema pangkalan data. Saya menambahkan komentar pada PR: *"Error handling untuk 404 sudah ditangani dengan baik sebelum db.delete() dipanggil."*

- **Graphite AI Comments (Komen Semakan AI Graphite):** *[Catatan: Ganti bagian ini dengan komentar ASLI dari Graphite di GitHub Anda. Contoh di bawah ini hanya ilustrasi]*
  Graphite menyoroti beberapa hal:
  1. Menyarankan penambahan *docstrings* pada setiap endpoint baru untuk menjelaskan apa yang dikembalikan oleh API.
  2. Memberikan peringatan terkait penggunaan tipe data yang mungkin tidak konsisten pada *return message* saat proses *Delete* berhasil.

- **Comparison (Perbandingan):** *[Sesuaikan dengan pengalaman Anda]*
  Secara keseluruhan, semakan AI dari Graphite sangat baik dalam mendeteksi gaya penulisan (*style*) dan dokumentasi yang terlewat seperti *docstrings*. Namun, ulasan manual saya lebih baik dalam memahami konteks fungsionalitas utama, yaitu memastikan alur ralat HTTP sesuai dengan kebutuhan bisnis API. 

- **Trust Level (Tingkat Kepercayaan terhadap AI Review):** *[Sesuaikan dengan pendapat Anda]*
  Saya merasa cukup nyaman mempercayai AI untuk menangkap masalah sintaksis, celah keamanan standar, dan kelengkapan dokumentasi. Namun, heuristik/panduan saya ke depan adalah: **Jangan pernah mempercayai AI 100% untuk logika bisnis yang kompleks.** Saya akan selalu mengandalkan semakan manual untuk memastikan fitur berjalan sesuai alur yang diinginkan pengguna.

## Task 2: Extend extraction logic
a. Links to relevant commits/issues
> TODO

b. PR Description
> TODO

c. Graphite Diamond generated code review
> TODO

## Task 3: Try adding a new model and relationships
a. Links to relevant commits/issues
> TODO

b. PR Description
> TODO

c. Graphite Diamond generated code review
> TODO

## Task 4: Improve tests for pagination and sorting
a. Links to relevant commits/issues
> TODO

b. PR Description
> TODO

c. Graphite Diamond generated code review
> TODO

## Brief Reflection 
a. The types of comments you typically made in your manual reviews (e.g., correctness, performance, security, naming, test gaps, API shape, UX, docs).
> TODO 

b. A comparison of **your** comments vs. **Graphite’s** AI-generated comments for each PR.
> TODO

c. When the AI reviews were better/worse than yours (cite specific examples)
> TODO

d. Your comfort level trusting AI reviews going forward and any heuristics for when to rely on them.
>TODO 



