# iFixit-like Backend

A RESTful API backend similar to iFixit that provides hierarchical device and repair guide data. This project demonstrates a complete backend implementation with Express.js, SQLite database, and deployment-ready configuration.

## 🚀 Features

- **Hierarchical Data Structure**: Categories → Devices → Repair Guides
- **RESTful API**: Clean and intuitive endpoints
- **SQLite Database**: Lightweight and portable database
- **CORS Enabled**: Ready for frontend integration
- **Security Headers**: Helmet.js for security
- **Logging**: Morgan for request logging
- **Deployment Ready**: Configured for Render, Docker, and other platforms

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ifixit-backend.git
   cd ifixit-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Initialize and seed the database**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 🎯 Usage

### Development

```bash
npm run dev    # Start with nodemon for auto-restart
```

### Production

```bash
npm start      # Start the production server
```

### Database Operations

```bash
npm run seed   # Populate database with sample data
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000
```

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:slug` | Get category by slug |
| GET | `/api/categories/:slug/devices` | Get devices in a category |

### Devices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/devices` | Get all devices |
| GET | `/api/devices/:slug` | Get device by slug |
| GET | `/api/devices/:slug/guides` | Get repair guides for a device |

### Guides

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/guides` | Get all repair guides |
| GET | `/api/guides/:slug` | Get guide by slug |

### Example Workflow

1. **Get all categories**
   ```bash
   curl http://localhost:3000/api/categories
   ```

2. **Get Apple devices**
   ```bash
   curl http://localhost:3000/api/categories/apple/devices
   ```

3. **Get iPhone 11 repair guides**
   ```bash
   curl http://localhost:3000/api/devices/iphone-11/guides
   ```

4. **Get specific repair guide**
   ```bash
   curl http://localhost:3000/api/guides/iphone-11-battery-replacement
   ```

## 🗄 Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Devices Table
```sql
CREATE TABLE devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER NOT NULL,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);
```

### Guides Table
```sql
CREATE TABLE guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  device_id INTEGER NOT NULL,
  difficulty TEXT,
  time_required TEXT,
  tools_required TEXT, -- JSON string
  parts_required TEXT, -- JSON string
  steps TEXT, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices (id)
);
```

## 🚀 Deployment

### Render (Recommended)

1. **Fork this repository**

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure deployment**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Set environment variables**
   ```
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Your API will be available at `https://your-app-name.onrender.com`

### Docker

1. **Build the image**
   ```bash
   docker build -t ifixit-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 ifixit-backend
   ```

### Manual Deployment

1. **Prepare the server**
   ```bash
   # Install Node.js and npm on your server
   # Clone the repository
   git clone https://github.com/yourusername/ifixit-backend.git
   cd ifixit-backend
   ```

2. **Install dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Set up environment**
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

4. **Initialize database**
   ```bash
   npm run seed
   ```

5. **Start the application**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | Database file path | `./database/ifixit.db` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |

### Sample Data

The project includes sample data for:
- **3 Categories**: Apple, Samsung, Google
- **11 Devices**: Various iPhone models, MacBook Pro, iPad, Galaxy phones, Pixel phones
- **8 Repair Guides**: Battery and screen replacements for different devices

## 🧪 Testing

### Manual Testing

Test the API endpoints using curl or a tool like Postman:

```bash
# Test server health
curl http://localhost:3000

# Test categories endpoint
curl http://localhost:3000/api/categories

# Test specific device
curl http://localhost:3000/api/devices/iphone-11

# Test device guides
curl http://localhost:3000/api/devices/iphone-11/guides
```

### Expected Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "count": 10 // for list endpoints
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## 📁 Project Structure

```
ifixit-backend/
├── database/
│   ├── db.js              # Database connection and setup
│   ├── seed.js            # Sample data seeding
│   └── ifixit.db          # SQLite database file
├── models/
│   ├── Category.js        # Category model
│   ├── Device.js          # Device model
│   └── Guide.js           # Guide model
├── routes/
│   ├── categories.js      # Category routes
│   ├── devices.js         # Device routes
│   └── guides.js          # Guide routes
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── .dockerignore          # Docker ignore rules
├── Dockerfile             # Docker configuration
├── render.yaml            # Render deployment config
├── package.json           # Node.js dependencies
├── server.js              # Main application file
└── README.md              # This file
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [iFixit API](https://www.ifixit.com/api/2.0/doc/)
- Built with [Express.js](https://expressjs.com/)
- Database powered by [SQLite](https://www.sqlite.org/)

## 📞 Support

If you have any questions or need help with deployment, please:

1. Check the [Issues](https://github.com/yourusername/ifixit-backend/issues) page
2. Create a new issue if your problem isn't already addressed
3. Provide detailed information about your environment and the issue

