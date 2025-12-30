import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  CreateLandingPageDto,
  CreateVariantDto,
  TrackEventDto,
  UpdateLandingPageDto,
  UpdateVariantDto,
} from '../application/dtos/request/landing-page.dto';
import {
  AbTestResultsDto,
  AnalyticsResponseDto,
  LandingPageResponseDto,
  VariantResponseDto,
} from '../application/dtos/response/landing-page.response.dto';
import { LandingPageService } from '../application/services/landing-page.service';

@Controller('landing-pages')
export class LandingPagesController {
  constructor(private readonly landingPageService: LandingPageService) {}

  // ========== Public Endpoints ==========

  @Get(':slug/public')
  @Serialize(LandingPageResponseDto)
  async getBySlugPublic(
    @Param('slug') slug: string,
    @Query('sessionId') sessionId?: string,
  ) {
    const page = await this.landingPageService.findBySlug(slug);

    // If A/B test, get variant for user
    if (page.isAbTest && sessionId) {
      const variant = await this.landingPageService.getVariantForUser(
        page.id,
        sessionId,
      );
      if (variant) {
        // Return variant sections instead of main page sections
        return {
          message: MESSAGES.LANDING_PAGE.RETRIEVED,
          data: { ...page, sections: variant.sections },
        };
      }
    }

    return {
      message: MESSAGES.LANDING_PAGE.RETRIEVED,
      data: page,
    };
  }

  @Post(':slug/track')
  async trackEvent(
    @Param('slug') slug: string,
    @Body() dto: TrackEventDto,
    @Req() req: Request,
  ) {
    const page = await this.landingPageService.findBySlug(slug);

    await this.landingPageService.trackEvent(
      page.id,
      dto,
      undefined, // No userId for public tracking
      (req as any).ip,
      (req as any).headers?.['user-agent'],
    );

    return {
      message: MESSAGES.LANDING_PAGE.EVENT_TRACKED,
    };
  }

  // ========== Admin CRUD Endpoints ==========

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(LandingPageResponseDto)
  async create(@Body() dto: CreateLandingPageDto, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    const page = await this.landingPageService.create(dto, userId);

    return {
      message: MESSAGES.LANDING_PAGE.CREATED,
      data: page,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(LandingPageResponseDto)
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const result = await this.landingPageService.findAll(page, limit);

    return {
      message: MESSAGES.LANDING_PAGE.LIST_RETRIEVED,
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(LandingPageResponseDto)
  async findOne(@Param('id') id: string) {
    const page = await this.landingPageService.findById(id);

    return {
      message: MESSAGES.LANDING_PAGE.RETRIEVED,
      data: page,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(LandingPageResponseDto)
  async update(@Param('id') id: string, @Body() dto: UpdateLandingPageDto) {
    const page = await this.landingPageService.update(id, dto);

    return {
      message: MESSAGES.LANDING_PAGE.UPDATED,
      data: page,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  async delete(@Param('id') id: string) {
    await this.landingPageService.delete(id);

    return {
      message: MESSAGES.LANDING_PAGE.DELETED,
    };
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(LandingPageResponseDto)
  async publish(@Param('id') id: string) {
    const page = await this.landingPageService.publish(id);

    return {
      message: MESSAGES.LANDING_PAGE.PUBLISHED,
      data: page,
    };
  }

  @Post(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(LandingPageResponseDto)
  async archive(@Param('id') id: string) {
    const page = await this.landingPageService.archive(id);

    return {
      message: MESSAGES.LANDING_PAGE.ARCHIVED,
      data: page,
    };
  }

  // ========== Variant Management Endpoints ==========

  @Post(':id/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(VariantResponseDto)
  async createVariant(@Param('id') id: string, @Body() dto: CreateVariantDto) {
    const variant = await this.landingPageService.createVariant(id, dto);

    return {
      message: MESSAGES.LANDING_PAGE.VARIANT_CREATED,
      data: variant,
    };
  }

  @Get(':id/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(VariantResponseDto)
  async getVariants(@Param('id') id: string) {
    const variants = await this.landingPageService.getVariants(id);

    return {
      message: 'Variants retrieved successfully',
      data: variants,
    };
  }

  @Patch('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(VariantResponseDto)
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    const variant = await this.landingPageService.updateVariant(variantId, dto);

    return {
      message: MESSAGES.LANDING_PAGE.VARIANT_UPDATED,
      data: variant,
    };
  }

  @Delete('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  async deleteVariant(@Param('variantId') variantId: string) {
    await this.landingPageService.deleteVariant(variantId);

    return {
      message: MESSAGES.LANDING_PAGE.VARIANT_DELETED,
    };
  }

  @Post('variants/:variantId/select-winner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  async selectWinner(@Param('variantId') variantId: string) {
    await this.landingPageService.selectWinner(variantId);

    return {
      message: MESSAGES.LANDING_PAGE.WINNER_SELECTED,
    };
  }

  // ========== Analytics Endpoints ==========

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(AnalyticsResponseDto)
  async getAnalytics(@Param('id') id: string) {
    const analytics = await this.landingPageService.getAnalytics(id);

    return {
      message: MESSAGES.LANDING_PAGE.ANALYTICS_RETRIEVED,
      data: analytics,
    };
  }

  @Get(':id/ab-test-results')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Serialize(AbTestResultsDto)
  async getAbTestResults(@Param('id') id: string) {
    const results = await this.landingPageService.getAbTestResults(id);

    return {
      message: 'A/B test results retrieved successfully',
      data: results,
    };
  }
}
