# Backend Ventrue

## Requirement

| Tool   | Version |
| ------ | ------- |
| NodeJS | > 16    |
| MySQL  | > 15    |

## Cara Menjalankan Backend

1. Jalankan `npm install` pada console
2. Buat file `.env` pada root directory dengan menggunakan template pada file [.env.example](.env.example).
    - `DATABASE_URL` isi dengan url string connection MySQL kalian untuk yang memakai MySQL bawaan Xampp biasanya connection string nya adalah `"mysql://root@localhost:3306/ventrue"`
    - `JWT_SECRET` isi dengan isian apapun. Variable ini berfungsi sebagai kunci rahasia untuk nge hash token JWT.
    - `SUPERUSER_NAME` isi dengan nama user untuk admin pertama.
    - `SUPERUSER_EMAIL` isi dengan email user untuk admin pertama.
    - `SUPERUSER_PASSWORD` isi dengan password user untuk admin pertama.
3. Jalankan `npx prisma migrate dev` untuk me-migrasi schema prisma ke database masing-masing. File [seed](prisma/seed.js) akan menyediakan data awalan berupa fakultas dan user admin pertama.
4. Jalankan `npm run dev` untuk menjalankan server backend pada mode development. Aplikasi akan berjalan pada [http://localhost:5000](http://localhost:5000).
5. Untuk melihat dokumentasi API dapat diakses pada route [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
6. (Opsional) Jalankan `npx prisma studio` untuk membuka prisma studio (alat crud database dari prisma). Dapat dibuka pada [http://localhost:5555](http://localhost:5555).
