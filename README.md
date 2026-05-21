# LocalCart Commerce Platform

A lightweight, fast, and easy-to-manage e-commerce platform built with Next.js, Node.js, and PostgreSQL.

## Features

### Customer Features
- User authentication (registration, login)
- Product browsing and filtering
- Shopping cart management
- Checkout and order placement
- Order tracking and history
- User profile management

### Admin Features
- Dashboard with sales overview
- Product management (CRUD operations)
- Order management and tracking
- Inventory monitoring
- Analytics and reporting
- Low stock alerts

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT
- **State Management**: Zustand
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd localcart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/localcart
   JWT_SECRET=your-secret-key
   ADMIN_EMAIL=admin@localcart.com
   ADMIN_PASSWORD=ChangeMe123!
   ```

4. **Initialize database**
   ```bash
   npm run db:migrate
   ```

5. **Seed sample data**
   ```bash
   npm run db:seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to access the application.

## Default Admin Credentials

- **Email**: admin@localcart.com
- **Password**: ChangeMe123!

⚠️ Change these immediately in production!

## Project Structure

```
localcart/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product endpoints
│   │   │   ├── orders/        # Order endpoints
│   │   │   ├── cart/          # Cart endpoints
│   │   │   ├── users/         # User endpoints
│   │   │   └── admin/         # Admin endpoints
│   │   ├── admin/             # Admin pages
│   │   ├── (pages)/           # Public pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utilities and helpers
│   │   ├── auth.ts            # Authentication functions
│   │   ├── api-client.ts      # Axios configuration
│   │   ├── middleware.ts      # API middleware
│   │   ├── store.ts           # Zustand stores
│   │   └── api-response.ts    # Response helpers
│   └── styles/                # Global styles
├── database/
│   ├── connection.js          # PostgreSQL connection
│   ├── migrate.js             # Database migration
│   ├── seed.js                # Sample data
│   └── queries.js             # Helper queries
├── public/                    # Static assets
├── uploads/                   # User uploads (images, etc)
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products/admin` - Create product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:id` - Remove from cart

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders (admin)

## Database Schema

The platform includes the following main tables:

- **users** - User accounts and authentication
- **products** - Product catalog
- **categories** - Product categories
- **cart** - Shopping carts
- **cart_items** - Items in carts
- **orders** - Customer orders
- **order_items** - Items in orders
- **payments** - Payment transactions

See `database/migrate.js` for complete schema details.

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run db:setup   # Setup database
npm run db:migrate # Run migrations
npm run db:seed    # Seed sample data
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (RBAC)
- Protected admin routes
- Input validation
- Secure environment variables
- SQL injection prevention via parameterized queries

## Performance Optimizations

- Server-side rendering with Next.js
- Client-side state management with Zustand
- Database indexing on frequently queried columns
- API response optimization
- Lazy loading images
- CSS-in-JS with Tailwind

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Email notifications
- Advanced analytics dashboard
- Product reviews and ratings
- Wishlist functionality
- Coupon and discount system
- Multi-currency support
- Mobile app
- Real-time notifications

## Troubleshooting

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists and credentials are correct

### Port 3000 already in use
```bash
lsof -i :3000
kill -9 <PID>
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue on GitHub or contact the development team.

## Changelog

### Version 0.1.0
- Initial release with MVP features
- User authentication
- Product catalog
- Shopping cart
- Order management
- Admin dashboard

---

**Made with ❤️ for local e-commerce businesses**
