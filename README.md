# Chart Dashboard

A modern, responsive analytics dashboard built with Next.js, TypeScript, and Recharts. This dashboard provides interactive data visualization with various chart types, metric cards, and a clean user interface.

## Features

- 📊 **Interactive Charts**: Line charts, bar charts, and pie charts using Recharts
- 📈 **Metric Cards**: Key performance indicators with trend indicators
- 👥 **User Management**: Data table displaying user information
- 🎨 **Modern UI**: Clean, responsive design with dark mode support
- 📱 **Mobile Responsive**: Optimized for all screen sizes
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-chart-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main dashboard page
├── components/         # Reusable components
│   ├── Header.tsx      # Dashboard header
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── MetricCard.tsx  # KPI metric cards
│   ├── LineChart.tsx   # Line chart component
│   ├── BarChart.tsx    # Bar chart component
│   ├── PieChart.tsx    # Pie chart component
│   └── DataTable.tsx   # Data table component
├── lib/               # Utility functions and data
│   └── data.ts        # Sample data for charts
└── types/             # TypeScript type definitions
    └── dashboard.ts   # Dashboard data types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding New Charts

1. Create a new chart component in `src/components/`
2. Import and use Recharts components
3. Add the component to the main dashboard page

### Modifying Data

Update the sample data in `src/lib/data.ts` to match your requirements.

### Styling

The dashboard uses Tailwind CSS for styling. You can customize the design by modifying the Tailwind classes or adding custom CSS.

## Deployment

The dashboard can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js.

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
