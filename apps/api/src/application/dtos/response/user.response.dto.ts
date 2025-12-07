import { Expose } from 'class-transformer';
import { Role } from '../../../domain/entities/user.entity';

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: Role;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
