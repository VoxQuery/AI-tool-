# VoxQuery - Digital Food Waste Tracker

A AI based web application designed to minimize food waste by tracking grocery purchases, predicting expiry dates, sending smart alerts, and suggesting recipes for items about to expire.

## Features

- **Smart Receipt Scanning**: Upload grocery receipts and automatically extract items using OCR
- **Expiry Prediction**: AI-powered expiry date prediction based on product type and storage conditions
- **Smart Alerts**: Customizable email notifications for items about to expire
- **Recipe Suggestions**: Get personalized recipe recommendations for expiring ingredients
- **Pantry Management**: Organize and track all your food items with detailed categorization
- **Mobile Responsive**: Fully responsive design that works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Browser Local Storage (for demo purposes)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd voxquery-food-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # Email configuration (optional for local development)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Database URL (for production use)
   DATABASE_URL=your-database-url
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
voxquery-food-tracker/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── pantry/        # Pantry CRUD operations
│   │   ├── upload-receipt/# Receipt processing
│   │   ├── expiry-alerts/ # Expiry notifications
│   │   ├── recipes/       # Recipe suggestions
│   │   └── settings/      # User settings
│   ├── pantry/           # Pantry dashboard page
│   ├── recipes/          # Recipe suggestions page
│   ├── settings/         # Settings page
│   ├── upload/           # Receipt upload page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Main navigation
│   └── theme-provider.tsx# Theme provider
├── lib/                  # Utility functions
│   ├── database.ts       # Database service
│   ├── expiry-predictor.ts# Expiry prediction logic
│   ├── ocr-parser.ts     # OCR and text parsing
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
│   └── pantry.ts         # Pantry-related types
└── hooks/                # Custom React hooks
    └── use-toast.ts      # Toast notifications
```

## API Endpoints

### Pantry Management
- `GET /api/pantry` - Get all pantry items
- `POST /api/pantry` - Add new pantry item
- `PUT /api/pantry/[id]` - Update pantry item
- `DELETE /api/pantry/[id]` - Delete pantry item

### Receipt Processing
- `POST /api/upload-receipt` - Upload and process receipt

### Alerts & Notifications
- `GET /api/expiry-alerts` - Get items near expiry

### Recipe Suggestions
- `GET /api/recipes` - Get recipe suggestions

### Settings
- `GET /api/settings` - Get user settings
- `POST /api/settings` - Update user settings


### Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start the production server**
   \`\`\`bash
   npm start
   \`\`\`

## Features in Detail

### Receipt Processing
- Upload images or PDFs of grocery receipts
- OCR text extraction (mock implementation for demo)
- Automatic item categorization and quantity detection
- Manual editing of extracted items before adding to pantry

### Expiry Prediction
- Rule-based expiry prediction system
- Considers product category and storage type
- Customizable prediction rules
- Visual indicators for items nearing expiry

### Smart Alerts
- Email notifications for expiring items
- Configurable notification timing (1-7 days before expiry)
- Visual alerts in the dashboard
- Priority sorting by expiry date

### Recipe Suggestions
- Recipe recommendations based on expiring ingredients
- Ingredient matching algorithm
- Prep and cook time estimates
- Step-by-step instructions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)
\`\`\`


