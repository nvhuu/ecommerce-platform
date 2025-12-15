import { SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export const SERIALIZE_KEY = 'serialize';

/**
 * Decorator to serialize response data to a specific DTO class
 * Uses class-transformer to transform plain objects to class instances
 *
 * @param dto - The DTO class to transform data into
 *
 * @example
 * @Serialize(UserResponseDto)
 * async findAll() {
 *   return await this.service.findAll();
 * }
 */
export const Serialize = (dto: ClassConstructor<unknown>) => {
  return SetMetadata(SERIALIZE_KEY, dto);
};
