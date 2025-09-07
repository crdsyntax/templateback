<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This project is a robust backend template built with NestJS and MongoDB, designed to accelerate API development with production-ready features. It implements a secure, scalable architecture with comprehensive authentication and role-based access control (RBAC) out of the box.

Key features include:
- 🔐 JWT-based authentication with refresh tokens
- 👥 Role-based access control (RBAC)
- 🛡️ Security best practices (Helmet, CORS, Rate Limiting)
- 📝 API documentation with Swagger
- 🧪 Comprehensive test coverage
- 🔄 Database migrations and seeders
- 🚀 Docker support for development and production

⚠️ **Security Note**: While this template implements security best practices, always conduct a thorough security review before deploying to production. If you discover any vulnerabilities, please report them by following the instructions in SECURITY.md

## 🚀 Tech Stack

### Core
- **Framework**: [NestJS](https://nestjs.com/) (v11)
- **Language**: TypeScript
- **Runtime**: Node.js (LTS)
- **Package Manager**: pnpm

### Database
- **Primary DB**: MongoDB with Mongoose ODM

### Authentication & Authorization
- **Authentication**: JWT with Passport.js
- **Password Hashing**: bcrypt
- **Rate Limiting**: @nestjs/throttler
- **Security**: Helmet, CORS, CSRF protection

### API & Documentation
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Class Validator & Class Transformer
- **Serialization**: Class Transformer
- **Request Validation**: DTOs with decorators

### Development Tools
- **Testing**: Jest (Unit, Integration, E2E)
- **Code Quality**: ESLint, Prettier, Husky
- **CI/CD**: GitHub Actions

## 🔐 Authentication & Authorization

### Authentication Flow
1. User logs in with credentials
2. Server validates credentials and issues JWT access token and refresh token
3. Access token is used for API authorization (short-lived)
4. Refresh token is used to obtain new access tokens (long-lived)

### Role-Based Access Control (RBAC)
- **Admin**: Full system access
- **Manager**: Manage users and content
- **User**: Basic access with limited permissions
- **Guest**: Read-only access (if applicable)

### Protected Routes
```typescript
@Controller('protected')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
export class ProtectedController {
  // Controller methods
}
```

## 🛠️ Project Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/templateback.git
   cd yourproyect
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env` with your configuration

4. **Database**
   - Ensure MongoDB is installed and running
   - Update the database connection string in `.env`

## 🚀 Running the Application

### Development

```bash
# Start in development mode with hot-reload
$ pnpm run start:dev

# Access the application at http://localhost:3000
# API documentation available at http://localhost:3000/api/docs
```

### Production

```bash
# Build the application
$ pnpm run build

# Start in production mode
$ pnpm run start:prod
```

## 🧪 Testing

```bash
# Run unit tests
$ pnpm run test

# Run e2e tests
$ pnpm run test:e2e

# Generate test coverage report
$ pnpm run test:cov

# Run tests in watch mode
$ pnpm run test:watch
```

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:3000/api/docs`
- JSON format: `http://localhost:3000/api/docs-json`

## 📦 Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── decorators/         # Custom decorators
│   ├── dto/               # Data Transfer Objects
│   ├── guards/            # Authentication guards
│   ├── tests/             # Test files
│   └── *.ts               # Core auth files
│
├── chat/                   # Chat module
│   ├── controllers/       # Request handlers
│   ├── dto/              # Data Transfer Objects
│   ├── gateways/         # WebSocket gateways
│   ├── schemas/          # Database schemas
│   ├── services/         # Business logic
│   └── tests/            # Test files
│
├── common/                # Shared utilities
│   ├── middleware/       # Global middleware
│   ├── schemas/          # Common schemas
│   ├── services/         # Shared services
│   └── types/            # TypeScript types
│
├── config/                # Application configuration
│   ├── *.config.ts       # Configuration files
│   └── database/         # Database configuration
│
├── event-failure/         # Event failure handling
│   ├── controllers/      # Request handlers
│   ├── dto/             # Data Transfer Objects
│   ├── schemas/         # Database schemas
│   └── services/        # Business logic
│
├── role-manager/          # Role management
│   ├── controllers/      # Request handlers
│   ├── dto/             # Data Transfer Objects
│   ├── enums/           # Enumerations
│   ├── schemas/         # Database schemas
│   ├── services/        # Business logic
│   └── tests/           # Test files
│
├── user/                  # User management
│   ├── controllers/      # Request handlers
│   ├── dto/             # Data Transfer Objects
│   ├── repositorys/     # Data access layer
│   ├── schemas/         # Database schemas
│   ├── services/        # Business logic
│   └── tests/           # Test files
│
├── app.module.ts         # Root module
└── main.ts              # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
