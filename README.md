# Assignment Cover Page Generator - Backend

Fast and efficient backend for generating assignment cover pages with PDF/DOCX download and direct email to print shops.

## Features

- ✅ Generate PDF cover pages (PDFKit)
- ✅ Generate DOCX cover pages (Docx)
- ✅ Send PDF directly to print shop via email (Nodemailer)
- ✅ Unique token generation for easy email search
- ✅ In-memory caching for fast responses
- ✅ Input validation and sanitization
- ✅ No database required
- ✅ Optimized with compression and helmet

## Project Structure

```
Backend/
├── server.js                 # Main server file
├── routes/
│   └── coverRoutes.js       # API routes
├── controllers/
│   └── coverController.js   # Request handlers
├── utils/
│   ├── pdfGenerator.js      # PDF generation with caching
│   ├── docxGenerator.js     # DOCX generation with caching
│   ├── emailService.js      # Email sending with nodemailer
│   ├── tokenGenerator.js    # Unique token generation
│   └── validator.js         # Input validation
├── package.json
├── .env.example
└── README.md
```

## Installation

1. **Clone and navigate to backend folder:**
```bash
cd Backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your SMTP credentials:
```env
PORT=5000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
PRINT_SHOP_EMAIL=printshop@example.com
```

**Gmail Setup:**
- Enable 2-Factor Authentication
- Generate App Password: https://myaccount.google.com/apppasswords
- Use the app password (not your regular password)

4. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### 1. Download PDF
```http
POST /api/cover/download/pdf
Content-Type: application/json

{
  "name": "John Doe",
  "studentId": "2021-1-60-001",
  "department": "Computer Science",
  "labGroup": "A1",
  "assignmentNo": "01",
  "assignmentName": "Data Structures Implementation",
  "submissionDate": "10/15/2024",
  "teacher": "Dr. Jane Smith"
}
```

**Response:** PDF file download

### 2. Download DOCX
```http
POST /api/cover/download/docx
Content-Type: application/json

{
  "name": "John Doe",
  "studentId": "2021-1-60-001",
  "department": "Computer Science",
  "labGroup": "A1",
  "assignmentNo": "01",
  "assignmentName": "Data Structures Implementation",
  "submissionDate": "10/15/2024",
  "teacher": "Dr. Jane Smith"
}
```

**Response:** DOCX file download

### 3. Send to Print Shop
```http
POST /api/cover/send-to-shop
Content-Type: application/json

{
  "name": "John Doe",
  "studentId": "2021-1-60-001",
  "department": "Computer Science",
  "labGroup": "A1",
  "assignmentNo": "01",
  "assignmentName": "Data Structures Implementation",
  "submissionDate": "10/15/2024",
  "teacher": "Dr. Jane Smith"
}
```

**Response:**
```json
{
  "success": true,
  "token": "ASGN-20241015-A7B9C2",
  "message": "PDF sent to print shop successfully"
}
```

## Token System

The token system allows print shop owners to easily search for print requests in their email:

- **Format:** `ASGN-YYYYMMDD-HHMM-HASH`
- **Example:** `ASGN-20241015-1430-A7B9C2`
- **Search:** Shop owner searches "ASGN-20241015-A7B9C2" in Gmail to instantly find the request

### Token Generator Options

Three token generation methods are available in `utils/tokenGenerator.js`:

1. **generateToken()** - Default: `ASGN-20241015-1430-A7B9C2`
2. **generateSimpleToken()** - Numeric: `ASGN82341567890`
3. **generateStudentToken()** - With student ID: `ASGN-2021160001-234567890`

## Caching System

The backend uses `node-cache` for in-memory caching:

- **Cache Duration:** 1 hour (3600 seconds)
- **Benefits:** 
  - Faster response times for repeated requests
  - Reduced CPU usage for PDF/DOCX generation
  - No database overhead
- **Cache Key:** JSON stringified cover data
- **Automatic Cleanup:** Expired entries cleaned every 10 minutes

## Performance Optimizations

1. **Compression:** Gzip compression for responses
2. **Helmet:** Security headers
3. **Caching:** In-memory cache for generated files
4. **Efficient Streaming:** Direct buffer streaming for downloads
5. **Input Validation:** Early validation to prevent unnecessary processing

## Customization

### Customize Cover Page Design

**PDF Design** (`utils/pdfGenerator.js`):
- Modify fonts, sizes, colors
- Adjust layout and spacing
- Add logos or graphics
- Change border styles

**DOCX Design** (`utils/docxGenerator.js`):
- Modify text styles and formatting
- Adjust spacing and alignment
- Change border styles
- Add custom sections

### Customize Email Template

Edit `utils/emailService.js` to modify:
- Email subject line
- HTML template design
- Attachment naming
- Additional information in email body

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Validation error (missing/invalid fields)
- `500` - Server error (generation or email failure)

Example error response:
```json
{
  "error": ["name is required", "Invalid date format for submission date"]
}
```

## Testing with cURL

```bash
# Download PDF
curl -X POST http://localhost:5000/api/cover/download/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "studentId": "2021-1-60-001",
    "department": "Computer Science",
    "labGroup": "A1",
    "assignmentNo": "01",
    "assignmentName": "Data Structures",
    "submissionDate": "10/15/2024",
    "teacher": "Dr. Smith"
  }' \
  --output cover.pdf

# Send to print shop
curl -X POST http://localhost:5000/api/cover/send-to-shop \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "studentId": "2021-1-60-001",
    "department": "Computer Science",
    "labGroup": "A1",
    "assignmentNo": "01",
    "assignmentName": "Data Structures",
    "submissionDate": "10/15/2024",
    "teacher": "Dr. Smith"
  }'
```

## Security Notes

- Input validation prevents XSS attacks
- Helmet adds security headers
- CORS configured for your frontend domain
- No sensitive data stored (stateless)
- Environment variables for credentials


## Troubleshooting

### Email not sending?
- Check SMTP credentials in `.env`
- For Gmail, ensure you're using App Password, not regular password
- Check if 2FA is enabled on your Google account
- Verify PRINT_SHOP_EMAIL is correct

### PDF/DOCX generation slow?
- First request will be slower (no cache)
- Subsequent identical requests use cache (much faster)
- Check server resources if consistently slow

### CORS errors?
- Update CORS configuration in `server.js` to allow your frontend domain

