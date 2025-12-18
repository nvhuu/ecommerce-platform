import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/response/user.response.dto';
import { UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(data: { email: string; password: string; name?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User();
    user.email = data.email;
    user.password = hashedPassword;

    const created = await this.userRepository.create(user);
    return plainToClass(UserResponseDto, created);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findAll(page?: number, limit?: number, search?: string) {
    const result = await this.userRepository.findAll({
      page,
      limit: limit || 10,
      search,
    });

    return {
      message: MESSAGES.USER.LIST_RETRIEVED,
      data: result.data.map((u) => plainToClass(UserResponseDto, u)),
      page: result.page,
      limit: result.limit,
      total: result.total,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER.NOT_FOUND);
    }
    return {
      message: MESSAGES.USER.RETRIEVED,
      data: plainToClass(UserResponseDto, user),
    };
  }

  async getCurrentUser(id: string) {
    return this.findOne(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER.NOT_FOUND);
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
      }
    }

    const updated = await this.userRepository.update(id, dto);
    return {
      message: MESSAGES.USER.UPDATED,
      data: plainToClass(UserResponseDto, updated),
    };
  }

  async remove(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER.NOT_FOUND);
    }

    await this.userRepository.delete(id);
    return {
      message: MESSAGES.USER.DELETED,
      data: null,
    };
  }
}
