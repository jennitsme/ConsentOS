# ConsentOS 🛡️

ConsentOS is a modern, privacy-first dashboard that empowers users to monitor, manage, and control their digital footprint across various third-party applications and services. 

Take back control of your data, track your active permissions, and seamlessly integrate with your favorite platforms.

## ✨ Features

- **Centralized Dashboard:** View all your active data permissions, connected apps, and data points in one place.
- **Real OAuth Integrations:** Securely connect and manage access to platforms like Google Workspace and Twitter/X using industry-standard OAuth 2.0 and PKCE.
- **Activity Monitoring:** Track exactly when and how your data is being accessed by third parties with real-time activity logs.
- **Privacy-First Architecture:** Built with security in mind, ensuring your OAuth tokens and personal data are handled securely.
- **Web3 Ready:** Built with future support for data monetization and decentralized identity (DID) via crypto wallets.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Prisma ORM](https://www.prisma.io/) with SQLite
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jennitsme/consentos.git
   cd consentos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the example environment file and fill in your OAuth credentials.
   ```bash
   cp .env.example .env
   ```
   *Note: You will need to create OAuth apps in the Google Cloud Console and Twitter Developer Portal to get your Client IDs and Secrets.*

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

- `/app` - Next.js App Router pages and API routes (including OAuth endpoints).
- `/components` - Reusable React UI components.
- `/prisma` - Database schema (`schema.prisma`) and SQLite database file.
- `/lib` - Utility functions and Prisma client initialization.

## 🔒 Security & OAuth Setup

To enable the "Connect" features on the dashboard, you must configure your OAuth providers:

1. **Google Workspace:** Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env` file. Ensure your redirect URI is set to `/api/auth/google/callback`.
2. **Twitter / X:** Set `TWITTER_CLIENT_ID` and `TWITTER_CLIENT_SECRET` in your `.env` file. Ensure your redirect URI is set to `/api/auth/twitter/callback`.

## 📄 License

This project is licensed under the MIT License.
