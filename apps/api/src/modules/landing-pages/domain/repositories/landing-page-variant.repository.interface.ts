import { LandingPageVariant } from '../entities/landing-page-variant.entity';

export abstract class ILandingPageVariantRepository {
  abstract create(
    data: Partial<LandingPageVariant>,
  ): Promise<LandingPageVariant>;
  abstract findById(id: string): Promise<LandingPageVariant | null>;
  abstract findByLandingPageId(
    landingPageId: string,
  ): Promise<LandingPageVariant[]>;
  abstract update(
    id: string,
    data: Partial<LandingPageVariant>,
  ): Promise<LandingPageVariant>;
  abstract delete(id: string): Promise<void>;
  abstract selectWinner(id: string): Promise<void>;
  abstract incrementViews(id: string): Promise<void>;
  abstract incrementConversions(id: string): Promise<void>;
  abstract updateConversionRate(id: string): Promise<void>;
}
