# VAYU AI Frontend Dashboard

Gen-AI + Blockchain Air Safety System - React Frontend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend server running (see backend repository)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## 📋 Features

### Real-Time Monitoring
- **Live Sensor Data**: PM2.5, CO, CO2, VOC readings with color-coded status
- **Smoke Prediction**: AI-powered risk assessment (LOW/MEDIUM/HIGH)
- **Air Classification**: Identifies cigarette, vehicle, cooking, chemical smoke
- **Fault Detection**: Sensor and fan health monitoring
- **Fan Control**: Manual override with intensity control
- **Blockchain Logs**: Immutable event logging with verification

### UI/UX
- Dark theme with gradient color scheme
- Real-time updates every 5 seconds
- Responsive card-based layout
- Loading and error states
- Glassmorphism effects
- Smooth animations and transitions

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SensorDataCard.jsx
│   ├── SmokePredictionCard.jsx
│   ├── AirClassificationCard.jsx
│   ├── FaultDetectionCard.jsx
│   ├── FanControlCard.jsx
│   ├── BlockchainLogsCard.jsx
│   ├── DeviceSelector.jsx
│   └── StatusIndicator.jsx
├── pages/              # Page components
│   └── Dashboard.jsx
├── services/           # API layer
│   └── api.js
├── hooks/              # Custom React hooks
│   ├── useDashboardData.js
│   ├── useFanControl.js
│   └── usePolling.js
├── utils/              # Utility functions
│   ├── constants.js
│   └── formatters.js
├── styles/             # Global styles
│   └── global.css
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## 🎨 Design System

### Color Palette
- **Primary Gradient**: `#667eea → #764ba2`
- **Success Gradient**: `#11998e → #38ef7d`
- **Warning Gradient**: `#f093fb → #f5576c`
- **Danger Gradient**: `#fa709a → #fee140`
- **Background**: `#0f0f23`

### Status Colors
- **Good**: Green (`#38ef7d`)
- **Moderate**: Yellow (`#f5576c`)
- **Unhealthy**: Orange (`#fa709a`)
- **Critical**: Red (`#fee140`)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_POLLING_INTERVAL=5000
VITE_DEFAULT_DEVICE_ID=ESP32_001
```

### API Endpoints

The frontend connects to the following backend endpoints:

- `GET /api/v1/dashboard/data/{device_id}` - Dashboard data
- `GET /api/v1/dashboard/devices` - List devices
- `GET /api/v1/dashboard/blockchain/logs` - Blockchain logs
- `GET /api/v1/sensor/status/{device_id}` - Sensor status
- `GET /api/v1/sensor/history/{device_id}` - Sensor history
- `POST /api/v1/control/override` - Manual fan override
- `DELETE /api/v1/control/override/{device_id}` - Clear override
- `GET /api/v1/control/status/{device_id}` - Control status

## 📦 Build for Production

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow component-based architecture
- Keep components focused and reusable
- Use CSS modules for component-specific styles
- Follow naming conventions (PascalCase for components, camelCase for functions)

## 🔗 Related Repositories

- **Backend**: [VayuAi-YCH](https://github.com/Nihit-Garg/VayuAi-YCH)
- **Frontend**: [VAYU_AI_FE2](https://github.com/aniketbhayana/VAYU_AI_FE2.git)

## 📝 License

MIT

## 🤝 Contributing

This is a hackathon project. For contributions, please contact the project maintainers.

## ⚠️ Important Notes

- Backend must be running for the dashboard to function
- Some backend endpoints may return 501 (Not Implemented) - the frontend handles this gracefully
- Real-time polling occurs every 5 seconds by default
- Manual fan override requires backend support

## 🎯 Future Enhancements

- Historical data charts
- Alert notifications
- Multi-device comparison
- Export data functionality
- Mobile app version
