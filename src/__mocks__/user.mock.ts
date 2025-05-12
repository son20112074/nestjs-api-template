import { User } from '../core/domain/entities/user.entity';
import { CreateUserDto } from '../interfaces/dtos/user/create-user.dto';
import { UpdateUserDto } from '../interfaces/dtos/user/update-user.dto';
import { Role } from '../shared/decorators/roles.decorator';

export const mockUser: Partial<User> = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'hashedPassword',
  roles: [Role.USER],
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  lastLoginAt: null,
  isEmailVerified: false,
  isTwoFactorEnabled: false,
  failedLoginAttempts: 0,
  fullName: 'John Doe',
  sanitizeData: () => mockUser,
};

export const mockCreateUserDto: CreateUserDto = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  roles: [Role.USER],
};

export const mockUpdateUserDto: UpdateUserDto = {
  firstName: 'Jane',
  lastName: 'Smith',
};

export const mockUserService = {
  create: async () => Promise.resolve(mockUser as User),
  findAll: async () => Promise.resolve([mockUser as User]),
  findById: async (id: string) => Promise.resolve(mockUser as User),
  update: async (id: string, dto: UpdateUserDto) => Promise.resolve({ ...mockUser, ...dto } as User),
  delete: async (id: string) => Promise.resolve(undefined),
}; 