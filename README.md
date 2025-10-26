# 🌪️ Cyclopedia Next.js

A comprehensive tropical cyclone tracking and visualization application built with Next.js 16, TypeScript, and Tailwind CSS. This application provides historical storm data analysis, live storm tracking, and interactive maps for both Atlantic and Pacific hurricane basins.

## 🚀 Features

### 📊 **Historical Storm Analysis**
- **Complete Storm Database**: Access to Atlantic (1851-2024) and Pacific (1949-2024) storm data
- **Storm Details**: Wind speeds, pressure, landfalls, casualties, and economic impact
- **Energy Metrics**: Accumulated Cyclone Energy (ACE) and Track Integrated Kinetic Energy (TIKE)
- **Visual Charts**: Interactive intensity, ACE/TIKE, and season comparison charts
- **Storm Images**: Historical satellite imagery and storm photos

### 🗺️ **Interactive Mapping**
- **Leaflet Integration**: High-performance mapping with multiple tile layers
- **Storm Tracks**: Visual representation of storm paths and intensity
- **Wind Field Visualization**: 34kt, 50kt, and 64kt wind radius data (2004+)
- **Live Weather Layers**: Real-time cloud, precipitation, wind, and pressure data
- **Areas of Interest**: Current tropical weather outlooks and storm potential

### 📱 **Progressive Web App (PWA)**
- **Installable**: Add to home screen on all devices
- **Offline Support**: Service worker caching for offline access
- **Install Prompt**: Automatic prompt to install the app
- **Theme Colors**: Branded appearance when installed
- **Responsive Design**: Mobile-first approach with touch-friendly UI
- **Standalone Mode**: Full-screen experience when installed

### 🔄 **Live Storm Tracking**
- **Real-Time Data**: Current active storms and their status
- **Forecast Cones**: NHC forecast tracks and uncertainty cones
- **Movement Analysis**: Speed and direction calculations
- **Advisory Integration**: Latest storm advisories and updates

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Leaflet** - Interactive maps
- **Chart.js** - Data visualization
- **Material-UI** - Component library
- **Service Workers** - PWA offline support
- **Workbox** - Service worker management

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **File System** - JSON-based data storage
- **CORS** - Cross-origin resource sharing

### **Data Sources**
- **HURDAT2** - Historical hurricane database
- **NHC** - National Hurricane Center live data
- **NOAA** - Weather service APIs
- **FEMA** - Real-time storm tracking

## 📁 Project Structure

```
cyclopedia-next/
├── app/
│   ├── api/                          # API routes
│   │   ├── archive/[basin]/[year]/   # Storm data endpoint
│   │   └── health/                   # Health check
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page
├── archive/                          # Storm data files
│   ├── atl/                          # Atlantic storms (1851-2024)
│   └── pac/                          # Pacific storms (1949-2024)
├── app/
│   ├── components/                   # React components
│   │   ├── ServiceWorkerRegister.tsx # PWA service worker
│   │   └── InstallPrompt.tsx         # Install prompt
│   ├── api/                          # API routes
│   └── layout.tsx                    # Root layout with PWA metadata
├── components/                       # Component library
│   ├── Interface.tsx                 # Main interface
│   ├── Map.tsx                       # Interactive map
│   ├── StormArchive.tsx              # Storm details
│   ├── SeasonArchive.tsx             # Season statistics
│   ├── LiveTracker.tsx               # Live storm tracking
│   └── ArchiveCharts.tsx             # Data visualization
├── contexts/
│   └── AppContext.tsx                # React context
├── libs/                             # Utility libraries
│   ├── hurdat.ts                     # Data fetching
│   ├── sum.ts                        # Math utilities
│   └── serviceWorker.ts              # Service worker utilities
├── public/                           # Static assets
│   ├── cyclone.png                   # App icon
│   ├── hurricane.jpg                 # Background image
│   ├── retired.png                   # Retired storm badge
│   ├── storm.ttf                     # Custom font
│   ├── manifest.json                 # PWA manifest
│   └── sw.js                         # Service worker
└── next.config.ts                    # Next.js configuration
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Modern web browser

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cyclopedia-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### **Production Build**

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📖 Usage Guide

### **Historical Analysis**

1. **Select Basin**: Choose Atlantic or Pacific
2. **Pick Year**: Select from 1851-2024 (Atlantic) or 1949-2024 (Pacific)
3. **Choose Storm**: Select specific storm from dropdown
4. **View Details**: See storm statistics, track, and impact data
5. **Analyze Charts**: Review intensity curves and energy metrics

### **Live Tracking**

1. **Toggle Mode**: Switch to "Live Tracker" mode
2. **View Active Storms**: See currently active tropical systems
3. **Weather Layers**: Enable/disable real-time weather data
4. **Storm Details**: Click storms for detailed information

### **Mobile Usage**

1. **Touch Navigation**: Swipe and tap to navigate
2. **Chart Expansion**: Tap charts to view full-screen
3. **Map Interaction**: Pinch to zoom, drag to pan
4. **Interface Toggle**: Use bottom interface panel

### **PWA Installation**

1. **Desktop**: Click the install prompt or browser menu
2. **Mobile**: Follow the install prompt in browser
3. **Standalone Mode**: App opens in fullscreen when installed
4. **Offline Access**: Cached content available without internet
5. **Updates**: Automatic service worker updates in background

## 🔧 API Endpoints

```
Returns API status and timestamp.

### **Storm Data**
```http
GET /api/archive/{basin}/{year}
```
- `basin`: `atl` (Atlantic) or `pac` (Pacific)
- `year`: 1851-2024 (Atlantic) or 1949-2024 (Pacific)

**Example:**
```bash
curl http://localhost:3000/api/archive/atl/2023
```

## 🔍 Data Sources

### **Historical Data**
- **HURDAT2**: Atlantic and Pacific hurricane database
- **NHC**: National Hurricane Center archives
- **NOAA**: Historical storm track data

### **Live Data**
- **NHC Advisories**: Current storm information
- **FEMA APIs**: Real-time storm tracking
- **NOAA Weather**: Live weather layers

### **Data Updates**
- Historical data is static (updated annually)
- Live data refreshes every 6 hours
- Forecast data updates every 6 hours

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **National Hurricane Center** for storm data and forecasts
- **NOAA** for historical hurricane databases
- **FEMA** for real-time storm tracking APIs
- **OpenStreetMap** for map tiles
- **React Leaflet** for mapping components
- **Chart.js** for data visualization

**Built with love for hurricane tracking and research**

