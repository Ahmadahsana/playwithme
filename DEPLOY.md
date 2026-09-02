# Deploy — PlayWithMe (static / cPanel)

Situs ini **100% statis** (tidak ada API / kode server). Cukup generate lalu
upload isinya ke document root domain.

## 1. Generate di lokal

```bash
npm install          # sekali saja / saat dependency berubah
npm run generate
```

Hasilnya ada di **`.output/public/`** — itulah isi yang di-upload.
`public/.htaccess` otomatis ikut ter-copy ke `.output/public/.htaccess`.

Buat arsip untuk di-upload:

```bash
# opsi zip (butuh paket `zip`)
cd .output/public && zip -r ../../playwithme-static.zip . && cd ../..

# atau tar.gz (selalu ada)
tar -czf playwithme-static.tar.gz -C .output/public .
```

## 2. Upload ke cPanel

1. **File Manager** → buka folder yang jadi document root domain
   (folder di luar `public_html` yang domainnya sudah Anda arahkan ke sana).
2. Kosongkan dulu isi lama folder itu bila ada.
3. **Upload** `playwithme-static.zip` ke folder tersebut.
4. Klik kanan file zip → **Extract** → extract ke folder yang sama.
5. Hapus file zip-nya. Pastikan `index.html` dan `.htaccess` ada **langsung**
   di root folder (bukan di dalam subfolder `public/`).
   - File Manager menyembunyikan file diawali titik → Settings → centang
     **Show Hidden Files** untuk melihat `.htaccess`.

## 3. Cek

- `https://domain-anda/` → halaman utama
- `https://domain-anda/about/` , `/playground/` , `/playground/galaxy/` dst.
- Ketik URL ngawur → balik ke situs (fallback SPA lewat `.htaccess`).

## Update berikutnya

Ulangi langkah 1–2. Karena `.htaccess` men-set HTML `no-cache`, perubahan
langsung terlihat; aset `/_nuxt/*` namanya ber-hash jadi tidak perlu clear cache.

## Catatan

- Butuh module Apache: `mod_rewrite`, `mod_headers`, `mod_deflate`, `mod_expires`
  (standar di hampir semua cPanel). Kalau `mod_headers`/`mod_expires` mati,
  situs tetap jalan, hanya caching kurang optimal.
- **Bukan** mode Node.js — jangan pakai "Setup Node.js App" di cPanel.
- `public/avatar_.png` (750 KB) adalah placeholder lama yang tidak dipakai —
  hapus dari `public/` supaya tidak ikut ter-deploy.
- `public/logo.png` (favicon) berukuran ~550 KB — sebaiknya dikecilkan ke
  ≤ 50 KB / dijadikan `.ico` atau PNG 64×64.
