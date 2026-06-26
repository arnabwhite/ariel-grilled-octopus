# Product Requirement Document (PRD) — Proyek Ariel (Task Management System)

Dokumen ini merangkum persyaratan produk, fungsionalitas, spesifikasi teknis, serta batasan desain untuk **Ariel**, sebuah Sistem Manajemen Tugas (*Task Management System*) premium dengan antarmuka minimalis bergaya Notion.

---

## 1. Ringkasan Produk & Latar Belakang

**Ariel** (sebelumnya dikenal sebagai *TaskFlow*) adalah platform kolaborasi internal yang dirancang untuk mengelola dan memantau progres tugas harian tim secara efisien. Sistem ini memiliki pembagian peran yang ketat (*Role-Based Access Control*), otentikasi berbasis JWT yang aman, serta menyajikan visualisasi yang bersih, modern, dan minimalis terinspirasi dari Notion untuk kenyamanan pengguna (UX) yang optimal.

---

## 2. Tujuan & Sasaran Bisnis
1. **Peningkatan Produktivitas**: Memudahkan tim mengidentifikasi tugas berdasarkan status pengerjaan (To Do, In Progress, Done) secara langsung.
2. **Keamanan Data**: Menerapkan otentikasi ketat agar data tugas internal hanya dapat diakses oleh personil terdaftar dengan otorisasi berbasis peran (Admin & User).
3. **Pengalaman Pengguna Premium**: Menggantikan tampilan antarmuka yang terkesan "dibuat oleh AI" dengan desain minimalis light theme bergaya Notion yang modern, halus, dan responsif.

---

## 3. Profil Pengguna & Otorisasi Peran

Aplikasi memiliki dua level otorisasi pengguna yang didefinisikan secara ketat pada tabel berikut:

| Fitur / Hak Akses | Peran: Administrator (Admin) | Peran: Pengguna Biasa (User) |
| :--- | :---: | :---: |
| **Login ke Aplikasi** | Ya | Ya |
| **Melihat Daftar Tugas (Board & Table)** | Ya | Ya |
| **Melakukan Pencarian & Filter Status** | Ya | Ya |
| **Membuat Tugas Baru (Create Task)** | Ya | **Tidak** |
| **Mengedit Detail Tugas (Edit Task)** | Ya | **Tidak** |
| **Menghapus Tugas (Delete Task)** | Ya | **Tidak** |
| **Mengubah Status Tugas (Drag / Quick Update)** | Ya | Ya |

---

## 4. Persyaratan Fungsional (Functional Requirements)

### A. Otentikasi & Keamanan (Auth Service)
* **Metode Otentikasi**: Otentikasi stateless menggunakan JSON Web Token (JWT).
* **Alur Sesi**: Pengguna memasukkan email dan kata sandi di halaman masuk (Login Page). Server memvalidasi kredensial dan mengembalikan JWT token. Token ini disimpan secara aman di sisi klien dan disisipkan di setiap header permintaan HTTP (`Authorization: Bearer <token>`).
* **Kredensial Bawaan (Seed Data)**:
  - Admin: `admin@ariel.com` / `AdminPassword123!`
  - Users: `alice@ariel.com`, `bob@ariel.com`, `charlie@ariel.com` / `UserPassword123!`

### B. Workspace Dashboard Layout
* **Layout Grid**: Menggunakan tata letak dua panel utama:
  - **Panel Kiri (Sidebar)**: Panel navigasi berlatar belakang `#f7f7f5` yang berisi nama workspace (*"Ariel Workspace"*), email aktif, menu perpindahan views (Board View & Table View), serta tombol *Sign Out* di bagian bawah.
  - **Panel Kanan (Workspace utama)**: Area penayangan data tugas dengan latar belakang putih bersih `#ffffff` dan margin halaman yang rapi.
* **Header Alignment**: Sidebar header dan Main content header harus memiliki tinggi yang sama persis (`56px`) untuk menjaga kelurusan horizontal garis pembatas bawah (*bottom border line*).

### C. Penayangan Tugas (Database Views)
* **Papan Kerja (Board View)**: Papan Kanban 3 kolom terstruktur:
  - **To Do**: Menampung tugas baru yang belum dikerjakan (pastel amber badge).
  - **In Progress**: Menampung tugas yang sedang dikerjakan (pastel blue badge).
  - **Done**: Menampung tugas yang telah diselesaikan (pastel green badge).
  - *Kontrol Admin*: Menyediakan tombol inline `+ New` di bagian bawah setiap kolom untuk membuat tugas baru langsung dengan status kolom terpilih.
* **Tabel Spreadsheet (Table View)**: Menampilkan tugas dalam format spreadsheet data minimalis dengan urutan naik berdasarkan ID tugas (`t.id ASC`). Header kolom wajib memiliki ikon deskriptif yang relevan.

### D. Kontrol Pencarian & Penyaringan (Filters)
* **Search Input**: Kotak pencarian dinamis yang menyaring tugas berdasarkan pencocokan string pada judul dan deskripsi secara waktu nyata (*real-time*).
* **Status Filter**: Dropdown filter status (All, To Do, In Progress, Done) untuk menyaring tugas dengan cepat pada ruang kerja utama.

### E. Dialog Pembuat & Editor Tugas (Modal Editor Page)
* **Tipe Komponen**: Menggunakan elemen dialog asli peramban (`<dialog>`) dengan efek animasi transisi skala/pudar halus saat terbuka.
* **Desain Dialog**:
  - Judul input tugas bersifat tanpa garis pembatas (*borderless*) bergaya Notion.
  - Property grid berisi: dropdown daftar email penerima tugas (Assignee), pilihan status tag, dan informasi waktu pembuatan (*Created time*, bersifat baca-saja dan hanya muncul saat mode pengeditan).
  - Bidang deskripsi merupakan textarea borderless berukuran dinamis.
  - **Diferensiasi Judul**: Header modal harus secara eksplisit menuliskan **"New Task"** jika membuat tugas baru dan **"Edit Task"** jika melakukan pengeditan tugas yang sudah ada.

### F. Umpan Balik Interaksi (Toasts Notification)
* Sistem menampilkan pemberitahuan melayang (*Toast*) di sudut kanan bawah setiap kali aksi simpan, ubah status, maupun hapus tugas berhasil dieksekusi untuk memberikan konfirmasi visual yang ramah bagi pengguna.

---

## 5. Persyaratan Non-Fungsional (Non-Functional Requirements)

### A. Performa & Stabilitas
* Kompilasi kode frontend dan backend harus bebas dari error bertipe statis maupun lint warnings.
* Penanganan kesalahan (*Exception Handling*) pada backend harus ditangani terpusat untuk mengembalikan respons JSON penanganan error yang seragam jika terjadi kegagalan sistem.

### B. Pembatasan Desain & Konvensi
* **Larangan Emoji**: Emojis dilarang keras digunakan untuk melambangkan tombol, navigasi, status, atau visual kosong. Semua representasi grafis wajib memakai **ikon vektor outline SVG**.
* **Kejelasan Tata Letak**: Tinggi header utama dashboard dikunci pada 56px (`notion-top-bar`) dengan vertical centering flexbox untuk mencegah teks breadcrumb terlalu mepet ke atas atau bawah dan memastikan border horizontal lurus.

---

## 6. Spesifikasi Lingkungan Teknis (Environment)

* **Sistem Operasi**: Linux / WSL (Ubuntu)
* **Runtime Backend**: Java JDK 25 & Maven 3.9.x
* **Runtime Frontend**: Node.js v24.x, NPM 11.x, & Angular CLI 22.0.x
* **Server Data**: Microsoft SQL Server Container (Port 1433, Port Eksternal sesuai konfigurasi)
