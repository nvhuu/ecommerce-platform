import { ShippingAddress } from '../entities/shipping-address.entity';

export interface IShippingAddressRepository {
  create(data: Partial<ShippingAddress>): Promise<ShippingAddress>;
  findAllByUserId(userId: string): Promise<ShippingAddress[]>;
  findById(id: string): Promise<ShippingAddress | null>;
  update(id: string, data: Partial<ShippingAddress>): Promise<ShippingAddress>;
  delete(id: string): Promise<void>;
  unsetDefault(userId: string): Promise<void>;
}
