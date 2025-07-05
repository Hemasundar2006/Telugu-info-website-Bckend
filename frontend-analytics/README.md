# Real-Time Website Analytics System

A comprehensive real-time analytics system for tracking website visitors, page views, events, and user behavior with live dashboard updates.

## Features

### Backend Features
- **Real-time tracking** with WebSocket support
- **Page view tracking** with unique visitor detection
- **Custom event tracking** (clicks, form submissions, scrolling, etc.)
- **Session management** with duration tracking
- **Geographic tracking** (country/city detection)
- **Device/browser detection** and categorization
- **RESTful API** for data retrieval
- **MongoDB storage** with optimized indexing
- **Comprehensive analytics dashboard** data

### Frontend Features
- **Automatic page view tracking** for SPAs and traditional websites
- **Event tracking** with customizable events
- **User identification** and session management
- **Offline support** with event queuing
- **Real-time dashboard** with live updates
- **Responsive design** with mobile support
- **Dark mode support**
- **Easy integration** with any website

## Installation

### Backend Setup

1. **Install dependencies**:
```bash
npm install socket.io uuid moment geoip-lite ua-parser-js
```

2. **Copy the backend files** to your project:
   - `src/models/analytics/analytics.js`
   - `src/controllers/analyticsController.js`
   - `src/services/analyticsSocketService.js`
   - `src/routers/analytics/analyticsRouter.js`

3. **Update your main server file** (server.js):
```javascript
const http = require("http");
const analyticsRouter = require("./src/routers/analytics/analyticsRouter");
const AnalyticsSocketService = require("./src/services/analyticsSocketService");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO service for analytics
const socketService = new AnalyticsSocketService(server);
app.set('socketService', socketService);

// Add analytics routes
app.use("/api/analytics", analyticsRouter);

// Start server with http server instead of app
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🔥 Analytics and WebSocket service initialized`);
});
```

### Frontend Setup

1. **Copy the frontend files**:
   - `analytics-tracker.js` - Main tracking script
   - `AnalyticsDashboard.jsx` - React dashboard component
   - `AnalyticsDashboard.css` - Dashboard styles

2. **Include Socket.IO client** in your HTML:
```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
```

3. **Configure and include the analytics tracker**:
```html
<script>
window.analyticsConfig = {
    apiUrl: 'http://localhost:4000/api/analytics',
    websocketUrl: 'http://localhost:4000',
    trackPageViews: true,
    trackEvents: true,
    trackScrolling: true,
    trackClicks: true,
    trackFormSubmissions: true,
    debug: false
};
</script>
<script src="analytics-tracker.js"></script>
```

## API Endpoints

### Analytics API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/session` | Generate new session ID |
| POST | `/api/analytics/track/pageview` | Track page view |
| POST | `/api/analytics/track/event` | Track custom event |
| POST | `/api/analytics/session/end` | End user session |
| GET | `/api/analytics/realtime` | Get real-time analytics |
| GET | `/api/analytics/dashboard` | Get dashboard data |
| GET | `/api/analytics/health` | Health check |

### Request Examples

**Track Page View**:
```javascript
POST /api/analytics/track/pageview
{
    "sessionId": "session-uuid",
    "page": "/home",
    "title": "Home Page",
    "referrer": "https://google.com",
    "screenResolution": { "width": 1920, "height": 1080 },
    "userId": "user-id" // optional
}
```

**Track Custom Event**:
```javascript
POST /api/analytics/track/event
{
    "sessionId": "session-uuid",
    "eventType": "click",
    "eventName": "Button Click",
    "page": "/home",
    "element": "button#signup",
    "value": "Sign Up Button",
    "coordinates": { "x": 100, "y": 200 }
}
```

**Get Dashboard Data**:
```javascript
GET /api/analytics/dashboard?period=7d
// Returns comprehensive analytics data
```

## Frontend Integration

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your content -->
    
    <!-- Analytics Integration -->
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script>
        window.analyticsConfig = {
            apiUrl: 'https://your-api-domain.com/api/analytics',
            websocketUrl: 'https://your-api-domain.com',
            debug: false
        };
    </script>
    <script src="analytics-tracker.js"></script>
</body>
</html>
```

### React Integration

```jsx
import React from 'react';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
    return (
        <div>
            <AnalyticsDashboard 
                apiUrl="https://your-api-domain.com/api/analytics"
                websocketUrl="https://your-api-domain.com"
            />
        </div>
    );
}
```

### Manual Tracking

```javascript
// Track custom events
analytics.track('Purchase', {
    productId: 'prod-123',
    amount: 29.99,
    currency: 'USD'
});

// Identify users
analytics.identify('user-123', {
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'premium'
});

// Track page views manually
analytics.page('Product Page', {
    productId: 'prod-123',
    category: 'Electronics'
});
```

## Configuration Options

### Analytics Tracker Configuration

```javascript
window.analyticsConfig = {
    // API Configuration
    apiUrl: 'http://localhost:4000/api/analytics',
    websocketUrl: 'http://localhost:4000',
    
    // Tracking Options
    trackPageViews: true,        // Auto-track page views
    trackEvents: true,           // Auto-track events
    trackScrolling: true,        // Track scroll events
    trackClicks: true,           // Track click events
    trackFormSubmissions: true,  // Track form submissions
    
    // Session Configuration
    sessionTimeout: 30,          // Session timeout in minutes
    
    // Debug
    debug: false                 // Enable debug logging
};
```

## Dashboard Features

### Real-time Metrics
- **Active Users**: Current users on your site
- **Page Views**: Real-time page view count
- **Events**: Custom event tracking
- **Geographic Data**: Visitor locations

### Historical Analytics
- **Page Views Over Time**: Trend analysis
- **Top Pages**: Most visited pages
- **Top Referrers**: Traffic sources
- **Device Breakdown**: Desktop/mobile/tablet
- **Browser Analytics**: Browser usage statistics
- **Country Analytics**: Geographic distribution

### Customizable Periods
- Last 24 hours
- Last 7 days
- Last 30 days
- Last 90 days

## WebSocket Events

### Client to Server
- `join-analytics`: Join analytics dashboard
- `user-activity`: Update user activity
- `page-view`: Real-time page view
- `custom-event`: Custom event tracking

### Server to Client
- `active-users-count`: Current active users
- `real-time-page-view`: Live page view updates
- `real-time-event`: Live event updates
- `user-activity-update`: User activity changes

## Database Schema

### Collections
- **PageViews**: Individual page view records
- **Sessions**: User session data
- **Events**: Custom event tracking
- **Analytics**: Daily analytics summaries
- **ActiveUsers**: Real-time active user tracking

### Indexes
Optimized indexes for performance:
- Page views by timestamp and page
- Sessions by start time and activity
- Events by timestamp and type
- Analytics by date

## Performance Considerations

### Backend Optimizations
- **Database indexing** for fast queries
- **Aggregation pipelines** for complex analytics
- **Connection pooling** for WebSocket connections
- **Cleanup jobs** for old data

### Frontend Optimizations
- **Event queuing** for offline support
- **Batch processing** for multiple events
- **LocalStorage** for session persistence
- **Debounced tracking** for scroll events

## Security

### Data Protection
- **IP anonymization** options
- **GDPR compliance** ready
- **No sensitive data** storage
- **Configurable data retention**

### API Security
- **CORS configuration**
- **Rate limiting** ready
- **Input validation**
- **Error handling**

## Troubleshooting

### Common Issues

1. **WebSocket connection fails**:
   - Check CORS configuration
   - Verify Socket.IO client version
   - Ensure server supports WebSocket

2. **Analytics not tracking**:
   - Check browser console for errors
   - Verify API endpoint URLs
   - Enable debug mode

3. **Dashboard not loading**:
   - Check API connectivity
   - Verify database connection
   - Check browser network tab

### Debug Mode

Enable debug mode for detailed logging:
```javascript
window.analyticsConfig = {
    debug: true,
    // ... other config
};
```

## Production Deployment

### Environment Variables
```bash
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/analytics
PORT=4000
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/analytics {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## License

MIT License - Feel free to use in your projects!

## Support

For issues and questions:
1. Check the troubleshooting section
2. Enable debug mode for detailed logs
3. Check browser console and network tab
4. Verify API endpoints are accessible

---

**Happy Analytics Tracking! 📊** 