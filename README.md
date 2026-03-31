# Bema Hub Waitlist

A Next.js waitlist application for Bema Hub, a Christian music campaign project. Collects and manages waitlist signups with Google Sheets integration.

## Tech Stack

- **Framework**: Next.js 16.2.1
- **UI**: React 19, Tailwind CSS 4
- **Components**: Radix UI, shadcn/ui
- **Data Storage**: Google Sheets (via Google Apps Script)
- **Phone Input**: react-international-phone
- **Table**: @tanstack/react-table

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
APPS_SCRIPT_URL=your_google_apps_script_web_app_url
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── core/
│   │   └── waitlist/       # Admin dashboard (view waitlist users)
│   └── page.tsx            # Landing page
├── components/
│   └── ui/                 # Reusable UI components
└── lib/
    └── googleSheets.ts     # Google Sheets API integration
```

## Features

- Landing page with rotating background images
- Waitlist signup form with international phone validation
- Referrer information capture
- Admin dashboard with:
  - Sortable columns
  - Global search
  - Pagination
  - User count display

## Deployment

Deployed at [bemahub.com](https://bemahub.com)
