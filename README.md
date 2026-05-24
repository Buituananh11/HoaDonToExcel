# Đọc Hóa Đơn → Excel

Web app đọc ảnh hóa đơn bằng AI, xuất file Excel.

## Deploy lên Vercel

### 1. Cài Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
cd invoice-app
vercel
```
Làm theo hướng dẫn, chọn defaults hết.

### 3. Thêm API Key (QUAN TRỌNG)
Vào **Vercel Dashboard** → Project → **Settings** → **Environment Variables**

Thêm:
```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-xxxxxxxxxxxxxxxx
```

Sau đó **Redeploy** (Deployments → Redeploy).

### 4. Xong!
Truy cập URL Vercel cấp là dùng được.

## Cấu trúc project
```
invoice-app/
├── api/
│   └── analyze.js      ← Serverless function (giữ API key an toàn)
├── public/
│   └── index.html      ← Frontend
├── vercel.json
└── package.json
```

## Local dev
```bash
npm i -g vercel
vercel dev
```
Tạo file `.env` ở root:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```
