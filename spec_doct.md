# Dokumentasi Aplikasi UniSphere

## Daftar Isi
1. [Tentang Aplikasi](#tentang-aplikasi)
2. [Masalah yang Diselesaikan](#masalah-yang-diselesaikan)
3. [Fitur-fitur Aplikasi](#fitur-fitur-aplikasi)
4. [Library dan Teknologi yang Digunakan](#library-dan-teknologi-yang-digunakan)
5. [Alur Pengguna (User Journey)](#alur-pengguna-user-journey)
6. [Struktur File](#struktur-file)
7. [Konfigurasi dan Instalasi](#konfigurasi-dan-instalasi)
8. [Database dan Struktur Data](#database-dan-struktur-data)

## Tentang Aplikasi

UniSphere adalah aplikasi web inovatif yang dirancang untuk mendukung kesehatan mental mahasiswa. Aplikasi ini menyediakan platform komprehensif yang menggabungkan kecerdasan buatan (AI) untuk memberikan dukungan emosional dan ruang aman bagi mahasiswa untuk berbagi pengalaman dan mencari bantuan secara anonim. Aplikasi ini memberikan pendekatan holistik terhadap dukungan kesehatan mental, dengan fokus pada kenyamanan, privasi, dan ketersediaan 24/7.

## Masalah yang Diselesaikan

Aplikasi UniSphere menangani berbagai tantangan kesehatan mental yang dihadapi oleh mahasiswa:

### 1. Kesendirian dan Ketidakmampuan untuk Berbagi
Banyak mahasiswa merasa kesepian dan tidak mampu untuk mengutarakan perasaan mereka secara langsung. UniSphere menyediakan platform untuk berbagi secara anonim tanpa rasa takut akan penilaian.

### 2. Keterbatasan Dukungan yang Tersedia
Dukungan konseling tradisional seringkali terbatas jumlahnya dan memiliki daftar tunggu yang panjang. UniSphere menyediakan dukungan 24/7 melalui AI yang dirancang secara empatik untuk menanggapi kebutuhan emosional mahasiswa.

### 3. Stigma Terkait Kesehatan Mental
Stigma sosial terkait kesehatan mental bisa mencegah mahasiswa untuk mencari bantuan. Dengan forum anonim dan chatbot AI, mahasiswa bisa mendapatkan bantuan tanpa mengungkapkan identitas mereka.

### 4. Keterbatasan Sumber Daya dan Kesadaran
Aplikasi ini menyediakan wawasan dan analisis yang membantu mahasiswa memahami tren kesehatan mental mereka, serta informasi penting bagi administrator kampus untuk mengidentifikasi kebutuhan dukungan yang lebih luas.

## Fitur-fitur Aplikasi

### 1. Chatbot AI Emosional
Fitur utama UniSphere berupa chatbot AI yang didukung oleh Google Gemini API. Chatbot ini:
- Memberikan respons empatik dan mendukung
- Menganalisis sentimen dalam percakapan
- Menyediakan dukungan kesehatan mental 24/7
- Menyesuaikan respons berdasarkan riwayat percakapan

### 2. Forum Anonim
Platform komunitas untuk:
- Berbagi pengalaman secara anonim
- Menyediakan dukungan antar mahasiswa
- Kategori dan sistem reaksi untuk diskusi yang lebih bermakna
- Sistem moderasi untuk menjaga lingkungan yang aman

### 3. Dashboard Analitik
Fitur yang memungkinkan:
- Pelacakan perkembangan kesehatan mental individu
- Wawasan sentimen berdasarkan percakapan dan postingan
- Analisis kampus keseluruhan untuk administrator
- Rekomendasi pribadi untuk kesejahteraan

### 4. Manajemen Profil
- Pembuatan profil anonim atau teridentifikasi
- Penyesuaian informasi pribadi
- Keamanan data pengguna

### 5. Sistem Pengaduan
- Platform untuk melaporkan masalah di lingkungan kampus
- Klasifikasi dan prioritas pengaduan
- Status pelacakan untuk permintaan

### 6. Fitur Pelacakan Mood
- Pencatatan harian kondisi emosional
- Analisis tren kesehatan mental
- Rekomendasi berdasarkan data mood

### 7. Notifikasi dan Pengingat
- Pemberitahuan untuk forum, balasan, dan chat
- Tips kesehatan mental harian
- Pengingat untuk menjaga rutinitas kesehatan mental

## Library dan Teknologi yang Digunakan

### Frontend
- **React 19.1.1**: Framework utama untuk pengembangan antarmuka pengguna
- **React Router 7.9.4**: Navigasi antar halaman dan rute aplikasi
- **Framer Motion 12.23.24**: Animasi dan transisi UI yang halus
- **Tailwind CSS 4.1.16**: Framework styling untuk tampilan responsif
- **Lucide React 0.546.0**: Ikon-ikon vektor berkualitas tinggi
- **React Hot Toast 2.6.0**: Sistem notifikasi dan pesan umpan balik

### Backend dan Database
- **Supabase 2.76.1**: Platform backend berbasis PostgreSQL dengan otentikasi, real-time, dan penyimpanan objek
- **Google Generative AI 0.24.1**: Integrasi AI untuk analisis sentimen dan pembuatan respons

### Jaringan dan HTTP
- **Axios 1.12.2**: Klien HTTP untuk permintaan API

### Utilitas dan Konfigurasi
- **dotenv 17.2.3**: Manajemen variabel lingkungan
- **Recharts 3.3.0**: Perpustakaan visualisasi data untuk dashboard

### Alat Pengembangan
- **Vite 7.1.7**: Build tool yang cepat untuk pengembangan frontend
- **ESLint 9.36.0**: Alat linting untuk menjaga kualitas kode
- **@vitejs/plugin-react 5.0.4**: Plugin untuk dukungan React di Vite

## Alur Pengguna (User Journey)

### 1. Pertama Kali Mengakses Aplikasi
- Pengguna diarahkan ke halaman beranda yang menampilkan fitur-fitur utama
- Pengguna dapat melihat demo atau menjelajahi forum tanpa login
- Untuk fitur lengkap, pengguna perlu membuat akun

### 2. Registrasi dan Login
- Pengguna dapat mendaftar dengan email dan password
- Sistem otomatis membuat profil berdasarkan informasi pendaftaran
- Pengguna dapat memilih untuk tetap anonim dalam beberapa fitur

### 3. Interaksi dengan Chatbot AI
- Pengguna masuk ke halaman chat
- Mengetik pesan atau memilih respons cepat
- Chatbot merespons dengan empati dan memahami sentimen
- Percakapan disimpan untuk konteks berkelanjutan

### 4. Berpartisipasi di Forum
- Pengguna dapat membaca postingan anonim
- Membuat postingan baru secara anonim atau teridentifikasi
- Komentar dan reaksi pada postingan orang lain
- Melacak diskusi yang diikuti

### 5. Monitor Kesehatan Mental
- Mencatat mood harian di dashboard
- Melihat wawasan dan analisis sentimen
- Mengakses rekomendasi pribadi

### 6. Melaporkan Isu
- Mengakses halaman pengaduan
- Membuat laporan dengan deskripsi dan bukti
- Melacak status permintaan

## Struktur File

```
C:\App_UniSphere\
├── .env                    # Variabel lingkungan (tidak disertakan di repo)
├── .env.example            # Contoh variabel lingkungan
├── .gitignore              # File yang diabaikan oleh Git
├── app_summary.md          # Ringkasan aplikasi
├── eslint.config.js       # Konfigurasi ESLint
├── index.html             # Template HTML utama
├── package.json           # Dependensi dan skrip proyek
├── package-lock.json      # Versi dependensi yang terkunci
├── README.md              # Panduan awal proyek
├── spec_doct.md           # Dokumentasi ini
├── supabase_buckets.sql   # Skema bucket Supabase
├── supabase_table.sql     # Skema tabel Supabase
├── vite.config.js         # Konfigurasi Vite
├── node_modules/          # Dependensi proyek
├── public/
│   └── vite.svg           # File aset publik
└── src/
    ├── App.jsx            # Komponen utama aplikasi
    ├── index.css          # Gaya global
    ├── main.jsx           # Titik masuk aplikasi
    ├── assets/            # File aset seperti gambar
    ├── components/        # Komponen berulang
    │   ├── Auth/          # Komponen autentikasi
    │   ├── ChatBot/       # Komponen chatbot
    │   ├── common/        # Komponen umum
    │   ├── Complaint/     # Komponen pengaduan
    │   ├── Dashboard/     # Komponen dashboard
    │   └── Forum/         # Komponen forum
    ├── hooks/             # Hook kustom
    │   └── useAuth.js     # Hook autentikasi
    │   └── useChat.js     # Hook chat
    ├── pages/             # Komponen halaman
    │   ├── Admin/         # Halaman admin
    │   ├── Chat/          # Halaman chat
    │   ├── Complaint/     # Halaman pengaduan
    │   ├── Forum/         # Halaman forum
    │   └── Home/          # Halaman beranda
    └── utils/             # Fungsi utilitas
        ├── supabase.js    # Konfigurasi Supabase
        └── geminiAI.js    # Konfigurasi dan fungsi AI
```

## Konfigurasi dan Instalasi

### Prerequisites
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Akses ke layanan Supabase
- Kunci API Google Gemini

### Langkah-langkah Instalasi

1. Clone repository
```bash
git clone [URL_REPOSITORY]
cd App_UniSphere
```

2. Instal dependensi
```bash
npm install
```

3. Buat file `.env` berdasarkan `.env.example`
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Jalankan aplikasi dalam mode pengembangan
```bash
npm run dev
```

5. Bangun aplikasi untuk produksi
```bash
npm run build
```

## Database dan Struktur Data

### Tabel Utama

1. **profiles**: Menyimpan informasi pengguna termasuk username, nama lengkap, avatar, dan biografi
2. **chat_sessions**: Mencatat percakapan antara pengguna dan AI chatbot
3. **forum_posts**: Menyimpan postingan forum dengan opsi anonim
4. **forum_comments**: Komentar pada postingan forum
5. **sentiment_reports**: Laporan sentimen dari percakapan pengguna
6. **admin_analytics**: Data analitik untuk administrator
7. **mood_tracking**: Catatan harian kondisi emosional pengguna
8. **notifications**: Sistem notifikasi dalam aplikasi
9. **complaints**: Sistem pelaporan dan keluhan pengguna

### Supabase Storage

1. **user-avatars**: Penyimpanan avatar pengguna
2. **forum-images**: Gambar yang diunggah di forum
3. **complaints-evidence**: Bukti pendukung untuk laporan
4. **chat-attachments**: Lampiran dalam percakapan

### Keamanan dan Kebijakan Akses

- Aplikasi menerapkan Row Level Security (RLS) di Supabase untuk mengontrol akses data
- Pengguna hanya dapat mengakses data milik mereka sendiri
- Administrator memiliki akses eksklusif ke data analitik dan laporan
- Semua akses ke tabel dan bucket dikendalikan melalui kebijakan RLS