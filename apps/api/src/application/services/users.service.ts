import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dtos/auth.dto';
import { UserResponseDto } from '../dtos/response';
import { HybridPaginatedDto } from '../dtos/response/hybrid-paginated.response.dto';
import { UpdateUserDto } from '../dtos/user.dto';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject(REQUEST)
    private readonly request: Request & { user?: { sub: string } },
  ) {}

  async findAll(
    cursor?: string,
    page?: number,
    limit: number = 10,
    search?: string,
  ): Promise<HybridPaginatedDto<UserResponseDto>> {
    const result = await this.userRepository.findAll({
      cursor,
      page,
      limit,
      search,
    });

    if (result.usedCursor) {
      return new HybridPaginatedDto(result.data, 'cursor', {
        hasNextPage: result.hasMore!,
        nextCursor: result.lastId
          ? Buffer.from(result.lastId).toString('base64')
          : undefined,
        limit,
      });
    } else {
      return new HybridPaginatedDto(result.data, 'offset', {
        total: result.total!,
        page: page || 1,
        limit,
      });
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updateData: Partial<User> = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = await this.userRepository.update(id, updateData);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const deletedBy = this.request.user?.sub;
    await this.userRepository.delete(id, deletedBy);
  }
}
