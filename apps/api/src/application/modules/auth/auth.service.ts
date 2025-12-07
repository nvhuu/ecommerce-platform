import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../dtos/auth.dto';
import { UserResponseDto } from '../../dtos/response';
import { toDto } from '../../utils/mapper.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Return user without password for validation
      return toDto(UserResponseDto, user);
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    return toDto(UserResponseDto, user) as UserResponseDto;
  }
}
