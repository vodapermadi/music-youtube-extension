# \[ADS Block ym\]

> \[singkatnya untuk blocking iklan yang ada di youtube music secara total \]

## 🚀 Fitur Utama

* **Antarmuka Popup Interaktif:** Dilengkapi dengan tampilan popup yang ringan dan responsif.

* **Content Scripts:** Berinteraksi langsung dengan halaman web yang sedang Anda buka untuk memanipulasi atau mengambil data.

* **Background Processing:** Menjalankan tugas di latar belakang (Service Worker) secara efisien tanpa mengganggu performa *browser*.

* **Rules Custom:** Menggunakan aturan (rules) khusus untuk memodifikasi *network requests* atau perilaku *browser*.

## 📂 Struktur Direktori

Berikut adalah penjelasan singkat mengenai struktur file dalam proyek ini:

```
├── content-scripts/    # Script yang dieksekusi di dalam konteks halaman web
├── rules/              # Aturan deklaratif (seperti declarativeNetRequest)
├── background.js       # Service worker untuk proses latar belakang
├── manifest.json       # File konfigurasi utama ekstensi Chrome
├── popup.html          # Halaman UI untuk popup ekstensi
├── popup.js            # Logika JavaScript untuk interaksi di popup
└── styles.css          # Gaya visual untuk antarmuka ekstensi

```

## 🛠️ Cara Instalasi (Pengembangan Lokal)

Karena ekstensi ini belum di-publish ke Chrome Web Store, Anda bisa menginstalnya secara manual di browser Chrome Anda (Mode Pengembang):

1. Unduh atau *clone* repositori ini ke komputer lokal Anda:

   ```
   git clone https://github.com/vodapermadi/music-youtube-extension.git
   
   ```

2. Buka Google Chrome dan ketik URL berikut di *address bar*: `chrome://extensions/`

3. Aktifkan **Developer mode** (Mode Pengembang) dengan mengklik *toggle* di pojok kanan atas.

4. Klik tombol **Load unpacked** (Muat yang tidak dikemas) di pojok kiri atas.

5. Pilih folder proyek ekstensi ini (folder yang berisi file `manifest.json`).

6. Selesai! Ekstensi sekarang sudah terpasang dan ikonnya akan muncul di *toolbar* Chrome Anda.

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda menemukan *bug* atau memiliki ide untuk fitur baru, silakan buat *Issue* atau *Pull Request*.

1. Fork repositori ini

2. Buat *branch* fitur Anda (`git checkout -b fitur/FiturBaru`)

3. Commit perubahan Anda (`git commit -m 'Menambahkan FiturBaru'`)

4. Push ke *branch* tersebut (`git push origin fitur/FiturBaru`)

5. Buka Pull Request

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.
