import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Setting, SettingType } from '@prisma/client';
import { ISettingRepository } from '../../domain/repositories/setting.repository.interface';
import { CreateSettingDto } from '../dtos/create-setting.dto';
import { SettingResponseDto } from '../dtos/setting-response.dto';
import { UpdateSettingDto } from '../dtos/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(ISettingRepository)
    private readonly settingRepository: ISettingRepository,
  ) {}

  async create(dto: CreateSettingDto): Promise<SettingResponseDto> {
    const existing = await this.settingRepository.findByKey(dto.key);
    if (existing) {
      throw new ConflictException(MESSAGES.SETTING.KEY_EXISTS);
    }

    // Validate value against type
    this.validateValue(dto.value, dto.type, dto.validation);

    const setting = await this.settingRepository.create(dto);
    return this.toResponseDto(setting);
  }

  async findAll(): Promise<SettingResponseDto[]> {
    const settings = await this.settingRepository.findAll();
    return settings.map((s) => this.toResponseDto(s));
  }

  async findByCategory(category: string): Promise<SettingResponseDto[]> {
    const settings = await this.settingRepository.findByCategory(category);
    return settings.map((s) => this.toResponseDto(s));
  }

  async findByKey(key: string): Promise<SettingResponseDto> {
    const setting = await this.settingRepository.findByKey(key);
    if (!setting) {
      throw new NotFoundException(MESSAGES.SETTING.NOT_FOUND);
    }
    return this.toResponseDto(setting);
  }

  async findPublic(): Promise<SettingResponseDto[]> {
    const settings = await this.settingRepository.findPublic();
    return settings.map((s) => this.toResponseDto(s));
  }

  async update(
    key: string,
    dto: UpdateSettingDto,
  ): Promise<SettingResponseDto> {
    const existing = await this.settingRepository.findByKey(key);
    if (!existing) {
      throw new NotFoundException(MESSAGES.SETTING.NOT_FOUND);
    }

    // Validate new value if provided
    if (dto.value && dto.type) {
      this.validateValue(dto.value, dto.type, dto.validation);
    }

    const updated = await this.settingRepository.update(key, dto);
    return this.toResponseDto(updated);
  }

  async delete(key: string): Promise<void> {
    const existing = await this.settingRepository.findByKey(key);
    if (!existing) {
      throw new NotFoundException(MESSAGES.SETTING.NOT_FOUND);
    }

    await this.settingRepository.delete(key);
  }

  private validateValue(
    value: string,
    type: SettingType,
    validation?: string,
  ): void {
    try {
      switch (type) {
        case SettingType.NUMBER:
          if (isNaN(Number(value))) {
            throw new Error(MESSAGES.SETTING.VALUE_MUST_BE_NUMBER);
          }
          break;
        case SettingType.BOOLEAN:
          if (value !== 'true' && value !== 'false') {
            throw new Error(MESSAGES.SETTING.VALUE_MUST_BE_BOOLEAN);
          }
          break;
        case SettingType.JSON:
          JSON.parse(value);
          break;
      }

      // TODO: Implement JSON schema validation if needed
      if (validation) {
        // const schema = JSON.parse(validation);
        // Validate against schema
      }
    } catch (error) {
      throw new ConflictException(
        error instanceof Error ? error.message : MESSAGES.SETTING.INVALID_VALUE,
      );
    }
  }

  private toResponseDto(
    setting: Setting | (Setting & { value: string }),
  ): SettingResponseDto {
    const dto = new SettingResponseDto();
    Object.assign(dto, setting);

    // Parse value based on type
    try {
      switch (setting.type) {
        case SettingType.NUMBER:
          dto.parsedValue = Number(setting.value);
          break;
        case SettingType.BOOLEAN:
          dto.parsedValue = setting.value === 'true';
          break;
        case SettingType.JSON:
          dto.parsedValue = JSON.parse(setting.value) as Prisma.JsonObject;
          break;
        default:
          dto.parsedValue = setting.value;
      }
    } catch {
      dto.parsedValue = setting.value;
    }

    return dto;
  }
}
