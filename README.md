# Taskly — Daftar Tugas Kuliah

Aplikasi daftar tugas kuliah sederhana menggunakan **TypeScript, Vite, dan npm**.

## Fitur
- Menampilkan daftar tugas beserta mata kuliah dan deadline.
- Menambah, mengedit, dan menghapus tugas.
- Mengubah status Belum Selesai / Selesai.
- Filter berdasarkan status dan ringkasan jumlah tugas.
- Penyimpanan lokal menggunakan browser Local Storage.
- Tampilan responsif untuk desktop dan ponsel.

## Menjalankan project
Pastikan Node.js dan npm sudah terpasang.

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal.

## Build
```bash
npm run build
npm run preview
```
Hasil build berada di folder `dist/`.

## Environment variables
Konfigurasi non-rahasia disimpan pada `.env`:
- `VITE_APP_NAME`: nama aplikasi.
- `VITE_APP_VERSION`: versi aplikasi.

Salin `.env.example` menjadi `.env` jika diperlukan. File `.env` diabaikan Git melalui `.gitignore`. Jangan pernah menyimpan password, token, atau API key rahasia dalam variabel `VITE_`, karena nilainya dapat ikut dikirim ke browser.

## Konsep teknologi
- **Git** adalah version control system untuk mencatat perubahan kode, membuat branch, menggabungkan pekerjaan, dan berkolaborasi melalui GitHub.
- **GitHub** adalah layanan hosting repository Git untuk menyimpan source code, melakukan push/pull, membuat Pull Request, dan meninjau perubahan.
- **npm** adalah package manager Node.js untuk memasang dan mengelola package. `package.json` mencatat metadata, dependencies, devDependencies, dan scripts.
- **Dependencies** adalah package yang dibutuhkan aplikasi saat berjalan. **DevDependencies** berisi alat bantu pengembangan/build seperti Vite dan TypeScript.
- **Semantic versioning** menggunakan pola `MAJOR.MINOR.PATCH` (contoh `1.2.3`). MAJOR untuk perubahan yang tidak kompatibel, MINOR untuk fitur baru yang kompatibel, PATCH untuk perbaikan bug.
- **Vite** menyediakan development server dan proses build yang cepat.
- **TypeScript** menambahkan sistem tipe pada JavaScript. TypeScript compiler (`tsc`) memeriksa tipe dan konfigurasi project. Pada project ini `tsc -b` dijalankan sebelum build.
- **Transpiler** mengubah kode TypeScript menjadi JavaScript yang dapat dipahami browser. Vite menggunakan esbuild untuk transformasi selama development dan proses build.
- **Bundler** menggabungkan serta mengoptimalkan modul dan aset aplikasi menjadi file produksi. Vite menggunakan Rollup pada proses build.
- **Environment variables** memisahkan konfigurasi dari kode. Variabel dengan awalan `VITE_` dapat diakses melalui `import.meta.env`, sehingga hanya gunakan untuk informasi non-rahasia.

## Contoh TypeScript di aplikasi
- Primitive: `appName: string`, `nextId: number`, `isDemoMode: boolean`.
- Array: `const initialTasks: Task[]`.
- Interface: `interface Task`.
- Type alias: `type TaskStatus`.
- Union type: `type TaskStatus = "Belum Selesai" | "Selesai"` dan filter status.
- Generics: `findById<T extends { id: number }>(...)`.

## Catatan deployment
Untuk GitHub Pages, build project dengan `npm run build`, lalu deploy isi folder `dist/` menggunakan GitHub Actions atau layanan hosting statis lain. Pastikan URL website pribadi mengarah ke hasil build, bukan ke folder source.
