# Apero API

A robust NestJS backend template with enterprise-level best practices, including authentication, CRUD operations, and more.

## Features

- 🚀 NestJS framework with TypeScript
- 🔐 JWT Authentication with access & refresh tokens
- 🌐 Google OAuth2 Authentication
- 📦 PostgreSQL with TypeORM
- 🔍 Swagger API documentation
- 🛡️ Role-based access control (RBAC)
- 🐳 Docker & Docker Compose setup
- ✨ Clean Architecture principles
- 📝 Comprehensive error handling
- 🔄 Environment-based configuration

## Project Structure

```
src/
├── core/                   # Application core modules
│   ├── domain/            # Domain entities and value objects
│   ├── application/       # Application services and use cases
│   └── ports/            # Interfaces/ports for external dependencies
├── infrastructure/        # External dependencies implementation
│   ├── config/           # Configuration modules
│   └── persistence/      # Database implementations
├── interfaces/           # Interface adapters (controllers, DTOs)
└── shared/              # Shared utilities and helpers
```

## Prerequisites

- Node.js (v18 or later)
- Docker & Docker Compose
- PostgreSQL (if running without Docker)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd apero-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Application
PORT=3000
API_PREFIX=api
NODE_ENV=development

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=apero_api

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials
5. Create OAuth 2.0 Client ID
6. Add authorized redirect URIs (e.g., http://localhost:3000/api/auth/google/callback)
7. Copy the Client ID and Client Secret to your .env file

## Running the Application

### Using Docker

1. Start the services:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f api
```

### Without Docker

1. Start PostgreSQL locally

2. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

Swagger documentation is available at: `http://localhost:3000/docs`

## Authentication

### Login with Email/Password
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login with Google
```bash
curl -X POST http://localhost:3000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your-google-id-token"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "expiresIn": 900
}
```

## CRUD Operations Example (Users)

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new.user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["user"]
  }'
```

### Get All Users
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer your-access-token"
```

### Get User by ID
```bash
curl -X GET http://localhost:3000/api/users/user-id \
  -H "Authorization: Bearer your-access-token"
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/user-id \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/user-id \
  -H "Authorization: Bearer your-access-token"
```

## Implementing New CRUD Features

1. Create Entity (e.g., `src/core/domain/entities/example.entity.ts`):
```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('examples')
export class Example extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;
}
```

2. Create DTOs (e.g., `src/interfaces/dtos/example/`):
```typescript
// create-example.dto.ts
export class CreateExampleDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;
}

// update-example.dto.ts
export class UpdateExampleDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
}
```

3. Create Repository (e.g., `src/infrastructure/persistence/repositories/example.repository.ts`):
```typescript
@Injectable()
export class ExampleRepository extends BaseTypeOrmRepository<Example> {
  constructor(
    @InjectRepository(Example)
    repository: Repository<Example>,
  ) {
    super(repository);
  }
}
```

4. Create Service (e.g., `src/core/application/services/example.service.ts`):
```typescript
@Injectable()
export class ExampleService extends BaseService<Example> {
  constructor(private readonly exampleRepository: ExampleRepository) {
    super(exampleRepository);
  }
}
```

5. Create Controller (e.g., `src/interfaces/controllers/example.controller.ts`):
```typescript
@ApiTags('examples')
@Controller('examples')
@UseGuards(JwtAuthGuard)
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createDto: CreateExampleDto) {
    return this.exampleService.create(createDto);
  }

  @Get()
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateExampleDto) {
    return this.exampleService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.exampleService.delete(id);
  }
}
```

6. Create Module (e.g., `src/interfaces/modules/example.module.ts`):
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleService, ExampleRepository],
  exports: [ExampleService],
})
export class ExampleModule {}
```

7. Register in AppModule:
```typescript
@Module({
  imports: [
    // ... other imports
    ExampleModule,
  ],
})
export class AppModule {}
```

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

[MIT licensed](LICENSE) 