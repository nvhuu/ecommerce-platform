import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * Transform entity or entities to ResponseDTO
 * @param dto - The ResponseDTO class
 * @param entity - The entity or array of entities
 * @returns Transformed DTO instance(s)
 */
export function toDto<T, V>(
  dto: ClassConstructor<T>,
  entity: V | V[],
): T | T[] {
  return plainToInstance(dto, entity, {
    excludeExtraneousValues: true,
    enableImplicitConversion: false,
  });
}
