# Badger - OSINT Data Extraction

Tool desktop moderno per l'estrazione di dati forensi da documenti. Supporta pattern per criptovalute, identificatori, dati personali, finanziari e di sicurezza.

## 🎯 Funzionalità

**Categorie di pattern rilevati:**

### 🔐 Criptovalute
- Bitcoin (Legacy, SegWit, Bech32)
- Ethereum (Address, Transaction)
- Monero, Tron
- Transaction Hash

### 🌐 Rete
- Indirizzi IP (IPv4, IPv6)
- MAC Address
- URL

### 👤 Dati Personali
- Email
- Numeri di telefono (IT, internazionali)
- IMEI
- Coordinate GPS
- Date (formati vari)

### 💰 Dati Finanziari
- Carte di credito
- IBAN
- Codici SWIFT

### 🆔 Identificatori
- Codice Fiscale (IT)
- Partita IVA (IT)
- Username social (Twitter/X, Instagram)
- ISBN

### 🔒 Sicurezza
- API Keys (AWS, GitHub)
- JWT Tokens
- Hash (MD5, SHA1, SHA256)
- Chiavi private SSH

**Formati supportati:** PDF, Excel (.xlsx, .xls), Word (.docx), CSV, TXT, JSON

**Caratteristiche:**
- Interfaccia moderna con shadcn/ui
- Tema chiaro/scuro
- Pattern regex personalizzabili
- Organizzazione per categorie
- Export CSV
- Ricerca nei risultati

## 📦 Installazione

### Debian/Ubuntu Linux

```bash
# Installa il pacchetto .deb
sudo dpkg -i src-tauri/target/release/bundle/deb/Badger_1.0.0_amd64.deb
```

### Altre distro Linux (AppImage)

```bash
chmod +x src-tauri/target/release/bundle/appimage/Badger_1.0.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/Badger_1.0.0_amd64.AppImage
```

## 🛠️ Build da sorgente

### Prerequisiti

**Linux (Debian/Ubuntu):**
```bash
# Dipendenze di sistema
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Windows:**
- [Node.js 18+](https://nodejs.org/)
- [Rust](https://rustup.rs/)
- [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (già incluso in Windows 10/11)

### Compilazione

```bash
npm install
npm run build
npx tauri build
```

Gli installer saranno in `src-tauri/target/release/bundle/`

### Build Windows

Su Windows:
```powershell
npm install
npm run build
npx tauri build
```

Output:
- `src-tauri/target/release/bundle/msi/Badger_1.0.0_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Badger_1.0.0_x64-setup.exe`

## 📁 Struttura Progetto

```
badger-new/
├── src/                 # Frontend React + TypeScript
│   ├── App.tsx         # Componente principale
│   ├── lib/
│   │   ├── patterns.ts    # Pattern regex OSINT
│   │   └── file-parser.ts # Parser file
│   └── components/     # Componenti shadcn/ui
├── src-tauri/          # Backend Tauri (Rust)
│   ├── tauri.conf.json # Configurazione app
│   └── icons/          # Icone app
└── package.json
```

## 🔧 Sviluppo

```bash
npm install
npm run tauri dev
```

## ⚙️ Impostazioni

L'app include un pannello impostazioni (icona ⚙️) con:
- **Tema**: Switch tra tema chiaro e scuro
- **Regex Built-in**: Attiva/disattiva pattern predefiniti per categoria
- **Regex Custom**: Aggiungi pattern personalizzati

