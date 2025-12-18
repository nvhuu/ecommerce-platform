import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IShippingAddressRepository } from '../../domain/repositories/shipping-address.repository.interface';
import {
  CreateShippingAddressDto,
  UpdateShippingAddressDto,
} from '../dtos/shipping-address.dto';

@Injectable()
export class ShippingAddressService {
  constructor(
    @Inject('IShippingAddressRepository')
    private readonly repository: IShippingAddressRepository,
  ) {}

  async create(userId: string, dto: CreateShippingAddressDto) {
    if (dto.isDefault) {
      await this.repository.unsetDefault(userId);
    }
    return this.repository.create({ ...dto, userId });
  }

  async findAll(userId: string) {
    return this.repository.findAllByUserId(userId);
  }

  async findOne(id: string, userId: string) {
    const address = await this.repository.findById(id);
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId)
      throw new ForbiddenException('Access denied');
    return address;
  }

  async update(id: string, userId: string, dto: UpdateShippingAddressDto) {
    const address = await this.findOne(id, userId); // check ownership
    if (dto.isDefault) {
      await this.repository.unsetDefault(userId);
    }
    return this.repository.update(id, dto);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // check ownership
    return this.repository.delete(id);
  }
}
