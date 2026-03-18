# DocServe AI

A smart online document and typing service platform built by TechBug. Users upload PDF/DOC files, get automatic cost estimates (₹20/page), submit payment via UPI, and receive processed documents after admin approval.

## Core User Flow
1. Upload document → auto page count + cost calculation
2. Pay via UPI → upload payment screenshot
3. Admin reviews → approves/rejects → uploads final file
4. User downloads final processed document

## Services Offered
- Document typing
- PDF formatting
- Resume building

## Key Constraints
- ₹20/page pricing (configurable via `COST_PER_PAGE` in `Upload.jsx`)
- PDF/DOC files only, max 20MB
- Payment screenshots: images only, max 5MB
- Admin panel uses simple session-based auth (upgrade to Firebase Auth for production)
