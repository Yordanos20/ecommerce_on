# E-Commerce Marketplace Application

A comprehensive multi-vendor e-commerce platform built with React, Node.js, and MySQL.

## 🚀 Features

### Customer Features
- **Product Browsing**: Advanced search, filtering, and sorting
- **Shopping Cart**: Add, update, and manage cart items
- **Checkout Process**: Secure payment integration with Chapa
- **Order Management**: Track orders, view history, request returns
- **Wishlist**: Save favorite products for later
- **Reviews & Ratings**: Rate and review purchased products
- **User Profile**: Manage account information and addresses

### Seller Features
- **Dashboard**: Sales analytics, order statistics, revenue tracking
- **Product Management**: Add, edit, delete products with variants
- **Inventory Management**: Stock alerts, low stock notifications
- **Order Processing**: Accept/reject orders, update status
- **Wallet System**: Track earnings, request withdrawals
- **Promotions**: Create discount offers and participate in flash sales

### Admin Features
- **Dashboard**: Complete system overview and analytics
- **User Management**: Approve sellers, manage users
- **Product Management**: Approve products, manage categories
- **Order Management**: View and manage all orders
- **Payment Management**: Monitor transactions, configure Chapa
- **Content Management**: Manage banners, static pages
- **Reports**: Export sales, product, and seller performance reports

## 🛠 Tech Stack

- **Frontend**: React 18, TailwindCSS, DaisyUI, Framer Motion
- **Backend**: Node.js, Express, MySQL
- **Payment**: Chapa Payment Gateway (Ethiopia)
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Email**: Nodemailer

## 📋 Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd E-commerce
```

### 2. Database Setup
```bash
# Import the database schema
mysql -u root -p < database/schema.sql
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### 4. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 5. Start Development Servers
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm start
```

### 6. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👤 Default Users

| Role | Email | Password |
|------|-------|----------|
| Admin | madmin@gmail.com | 123456 |
| Customer | customer@test.com | 123456 |
| Seller | seller@test.com | 123456 |

## 🐳 Docker Deployment

### Quick Deploy with Docker
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Deploy
chmod +x deploy.sh
./deploy.sh
```

### Manual Docker Commands
```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
E-commerce/
├── backend/                 # Node.js API server
│   ├── controllers/         # Route controllers
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── middleware/         # Auth middleware
│   └── uploads/            # File uploads
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── services/       # API services
├── database/               # Database schema
├── nginx/                  # Nginx configuration
└── docker-compose.yml      # Docker configuration
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=ecommerce

# Server
PORT=5000
JWT_SECRET=your_secret_key

# Chapa Payment
CHAPA_SECRET_KEY=your_chapa_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email
SMTP_PASS=your_password
```

## 💳 Payment Integration

The application integrates with **Chapa Payment Gateway** for Ethiopian market:

1. **Setup**: Get your Chapa API keys from [Chapa Dashboard](https://chapa.co/)
2. **Configure**: Add `CHAPA_SECRET_KEY` to your `.env` file
3. **Test**: Use test keys for development
4. **Production**: Switch to live keys for production

### Supported Payment Methods
- Mobile Money (Telebirr, M-Pesa, etc.)
- Bank Cards
- Bank Transfer

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (Customer, Seller, Admin)
- Password hashing with bcrypt
- SQL injection protection
- XSS protection
- CORS configuration
- Input validation and sanitization

## 📊 Analytics & Reporting

- Sales reports (daily, monthly, yearly)
- Product performance analytics
- Seller performance tracking
- Customer behavior insights
- Revenue analytics with charts

## 🎨 UI/UX Features

- Responsive design (mobile-friendly)
- Dark mode support
- Modern UI with TailwindCSS
- Smooth animations with Framer Motion
- Loading states and error handling
- Toast notifications

## 🔄 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Add product (seller)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id` - Update order status

### Payment
- `POST /api/chapa-payment/initialize` - Initialize payment
- `POST /api/chapa-payment/verify` - Verify payment

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Production Deployment

### Option 1: Docker (Recommended)
```bash
./deploy.sh
```

### Option 2: Manual Deployment
1. Set up production database
2. Configure environment variables
3. Build frontend: `npm run build`
4. Start backend with process manager (PM2)
5. Set up reverse proxy (Nginx)
6. Configure SSL certificate

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push to branch
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@yourdomain.com

## 🔄 Updates & Maintenance

- Regular security updates
- Feature enhancements
- Performance optimizations
- Bug fixes

---

**Built with ❤️ for the Ethiopian e-commerce market**
