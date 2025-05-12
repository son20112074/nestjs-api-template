import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserController } from '../interfaces/controllers/user.controller';
import { UserService } from '../core/application/services/user.service';
import { mockUser, mockCreateUserDto, mockUpdateUserDto } from '../__mocks__/user.mock';
import { User } from '../core/domain/entities/user.entity';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { mockJwtAuthGuard, mockRolesGuard, mockExecutionContext } from '../__mocks__/auth.mock';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
        {
          provide: RolesGuard,
          useValue: mockRolesGuard,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      service.create.mockResolvedValue(mockUser as User);

      const result = await controller.createUser(mockCreateUserDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      service.create.mockRejectedValue(new ConflictException('Email already exists'));

      await expect(controller.createUser(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser, { ...mockUser, id: '2' }] as User[];
      service.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      service.findById.mockResolvedValue(mockUser as User);

      const result = await controller.findOne('1');

      expect(service.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      service.findById.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findById).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...mockUpdateUserDto } as User;
      service.update.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', mockUpdateUserDto);

      expect(service.update).toHaveBeenCalledWith('1', mockUpdateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      service.update.mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        controller.updateUser('nonexistent', mockUpdateUserDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith('nonexistent', mockUpdateUserDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      service.update.mockRejectedValue(new ConflictException('Email already exists'));

      await expect(
        controller.updateUser('1', { ...mockUpdateUserDto, email: 'existing@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.deleteUser('1');

      expect(service.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user not found', async () => {
      service.delete.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.deleteUser('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.delete).toHaveBeenCalledWith('nonexistent');
    });
  });
}); 