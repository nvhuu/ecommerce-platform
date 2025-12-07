import { Role } from '../../domain/entities/user.entity';

export class CreateUserDto {
  email!: string;
  password!: string;
  role?: Role;
}

export class LoginDto {
  email!: string;
  password!: string;
}
