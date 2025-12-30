import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class TrackProductViewDto {
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  referrer?: string;
}

export class TrackSearchDto {
  @IsString()
  query!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  sessionId!: string;

  @IsInt()
  resultsCount!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  clickedResults?: string[];

  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  sortBy?: string;
}

export class TrackCheckoutStepDto {
  @IsString()
  stepType!: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsObject()
  stepData?: Record<string, unknown>;
}

export class TrackCartAbandonmentDto {
  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsArray()
  cartItems!: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;

  @IsInt()
  cartTotal!: number;
}
