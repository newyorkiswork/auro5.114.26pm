# Laundromat Booking Application

A modern web application for booking laundry machines, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication and profile management
- Calendar-based booking system with 15-minute slots
- Machine type selection (washer/dryer)
- Booking management and history
- Real-time availability updates
- Responsive design for all devices

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Query
- Prisma (for database management)

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [your-project-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Sandbox Mode (set to 'false' to disable)
SANDBOX_MODE=true

# Hume Configuration (if using voice features)
HUME_API_KEY=your_api_key
HUME_SECRET_KEY=your_secret_key
HUME_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_HUME_CONFIG_ID=your_config_id
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

This application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Configure environment variables in the Vercel dashboard
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the sandbox database

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── contexts/         # React contexts
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # API routes
├── prisma/          # Database schema and migrations
├── public/          # Static assets
├── services/        # API service functions
├── styles/          # Global styles
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
