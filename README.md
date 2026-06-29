# Sistem Manajemen Tugas Ariel

Sistem Manajemen Tugas (*Task Management System*) berbasis peran (*role-based*) yang dirancang secara minimalis menggunakan **Spring Boot v3.x** dan **Angular v22.x** dengan **Microsoft SQL Server**, serta menampilkan antarmuka Notion Light Theme yang bersih dan fitur UX modern.

---

## 🛠️ Tech Stack & Alat Pengembangan

* **Backend**: Spring Boot 3.3.0, Java 17+, Spring Security 6, JJWT (JWT), Hibernate / Spring Data JPA, Lombok
* **Frontend**: Angular 22, Reactive Forms, Tailwind CSS
* **Database**: Microsoft SQL Server 2022 (Berjalan di Docker)
* **Lingkungan Dev**: WSL2 (Ubuntu), Docker Engine, Maven

---

## 📋 Database & String Koneksi

Kami menjalankan Microsoft SQL Server menggunakan Docker Compose pada port **1433**.

### 1. String Koneksi (Spring Boot)
String koneksi yang digunakan pada berkas `application.properties` adalah:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=task_db;encrypt=true;trustServerCertificate=true;
spring.datasource.username=sa
spring.datasource.password=Ariel@Password123!
```

### 2. Inisialisasi Data Awal (Seed Data)
Tabel database dan peran didefinisikan dalam berkas `schema.sql`. Berkas tersebut menginisialisasi pengguna bawaan berikut:
* **Pengguna Admin**:
  - Email: `admin@ariel.com`
  - Kata Sandi: `AdminPassword123!`
  - Peran (Role): `ADMIN`
* **Pengguna Standar**:
  - Email: `alice@ariel.com`, `bob@ariel.com`, `charlie@ariel.com`
  - Kata Sandi: `UserPassword123!`
  - Peran (Role): `USER`

---

## 🚀 Cara Menjalankan Aplikasi

### Langkah 1: Jalankan Microsoft SQL Server dan Seeder
Mulai kontainer Docker untuk SQL Server:
```bash
docker compose up -d
```
Pastikan kontainer telah berjalan dengan baik:
```bash
docker ps
```

Cek log container untuk memastikan seeding berhasil:
```bash
docker logs task_db_init
```

### Langkah 2: Jalankan Backend Spring Boot
Masuk ke direktori `backend` dan jalankan aplikasi:
```bash
cd backend
mvn spring-boot:run
```
Server backend akan berjalan pada [http://localhost:8080](http://localhost:8080).

### Langkah 3: Jalankan Frontend Angular
Masuk ke direktori `frontend`, pasang dependensi, lalu jalankan server pengembangan:
```bash
cd frontend
npm install
npm start
# atau
ng serve
```
Aplikasi frontend dapat diakses melalui peramban pada alamat [http://localhost:4200](http://localhost:4200).

---

## 🧑‍💻 Kredensial untuk Pengujian

Gunakan kredensial bawaan berikut untuk masuk ke aplikasi:
1. **Akses Administrator (Admin)**:
   - Email: `admin@ariel.com`
   - Kata Sandi: `AdminPassword123!`
2. **Akses Pengguna Biasa (User)**:
   - Email: `alice@ariel.com`, `bob@ariel.com`, `charlie@ariel.com`
   - Kata Sandi: `UserPassword123!`
