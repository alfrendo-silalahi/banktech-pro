# Bank Tech Pro

Repository Bank Tech Kelompok 5 Bootcamp

## 🚀 Features

- **Home Page** - Welcome page with introduction
- **Navigation** - Active page highlighting and smooth navigation
- **Error Handling** - 404 pages and post not found handling
- **Browser History** - Full browser back/forward support

## 🛠️ Tech Stack

- **React 19** - Frontend framework
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Styling and responsive design
- **Vite** - Build tool and development server

## 📦 Installation

1. **Clone repository ini**
    ```bash
    git clone https://github.com/alfrendo-silalahi/banktech-pro.git
    cd banktech-pro
    ```

2. **Install Dependency**
    ```bash
    npm install
    ```

    - atau jika anda menggunakan package manager lain:
    ```bash
    # yarn
    yarn install

    #pnpm
    pnpm install
    ```

3. **Buat Branch untuk Collaboration**
    - Membuat branch pribadi - gunakan nama branch "feat/nama-depan"
    ```bash
    git checkout -b "nama-branch"
    ```
    - contoh nama branch: feat/alfito

    > [!IMPORTANT]
    > Pastikan tiap edit program di `branch` lokal kalian masing - masing
    > `main` lokal hanya untuk menerima program terbaru dari github cloud

4. **Update Program terbaru dari Cloud**
    - Pastikan sudah di branch main lokal terlebih dahulu
    1. Bisa pakai GUI yang ada di vscode kalian
    2. Bisa melalui terminal dengan cara:
    ```bash
    git checkout main
    ```

    - kemudian ambil data dari main cloud dengan cara:
    ```bash
    git pull origin main
    ```

    - Jangan lupa dipindahkan dulu ke branch kalian sebelum edit dengan cara:
    1. Pindah dulu ke branch kalian, bisa dari GUI vscode atau terminal seperti:
    ```bash
    git checkout 'nama-branch'
    ```
    2. Kemudian di branch kalian, merge dari main ke branch dengan cara:
    ```bash
    git merge main
    ```

    - Dan silahkan kalian bekerja di branch kalian ini

5. **Update ke Github Cloud**
    - Ketika kalian sudah bekerja dan ingin update ke cloud
    > [!IMPORTANT]
    > Pastikan kalian masih di branch kalian
    
    - Kemudian Kalian bisa upload ke github cloud kalian dengan cara:
    1. Add dulu ke dalam git
    ```bash
    git add .
    ```
    2. Kemudian berikan commit dan pesan kalian yang berisi update apa
    ```bash
    git commit -m 'Pesan Kalian'
    ```
    3. Kemudian push ke branch cloud kalian dan jangan di main
    ```bash
    git push origin 'nama-branch'
    ```
    - contoh:
    ```bash
    git push origin feat/alfito
    ```

    - Anda sudah berhasil update

6. **Membuat Pull Request**
    - Buka Website Github dibagian repo ini
    - Kemudian buat Pull Request dengan Reviewer Alfrendo

> [!IMPORTANT]
> Jika kalian ingin bekerja lagi setelah update
> Bisa langsung lakukan langkah ke-4

## 🏃‍♂️ Menjalankan Aplikasi

1. Jalankan Server
    ```bash
    npm run dev
    ```

2. Buka Browser anda dan kunjungi `https://localhost:5173` (atau alamat yang muncul di terminal anda)