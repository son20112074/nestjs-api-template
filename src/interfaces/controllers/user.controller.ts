import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../../core/application/services/user.service';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { User } from '../../core/domain/entities/user.entity';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles, Role } from '../../shared/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
