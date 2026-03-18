# DocServe AI

Smart online document & typing service platform by TechBug.

## Setup

### 1. Install dependencies
```bash
cd docserve-ai
npm install
```

### 2. Configure Firebase
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Firestore**, **Storage**, and **Authentication**
3. Copy your config into `src/firebase.js`
4. Deploy security rules:
```bash
firebase deploy --only firestore:rules,storage
```

### 3. Configure Admin Credentials
Edit `src/context/AdminAuthContext.jsx` and update:
```js
const ADMIN_EMAIL = 'your@email.com'
const ADMIN_PASSWORD = 'yourpassword'
```

### 4. Configure UPI Details
Edit `src/pages/Payment.jsx`:
```js
const UPI_ID = 'yourname@upi'
const UPI_NAME = 'Your Name'
```

### 5. Run locally
```bash
npm run dev
```

### 6. Build for production
```bash
npm run build
```

## Pages
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/upload` | Upload document & submit order |
| `/payment/:orderId` | Payment page |
| `/order-status` | Track order by phone or ID |
| `/profile` | TechBug profile |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin order management |

## Firestore Schema (`orders` collection)
```
name, phone, instructions, file_url, file_name,
pages, cost, payment_ss_url, transaction_id,
status, final_file_url, created_at
```

## Pricing
Default: ₹20/page — change `COST_PER_PAGE` in `src/pages/Upload.jsx`
