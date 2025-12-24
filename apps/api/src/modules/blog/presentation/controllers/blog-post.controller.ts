import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { BlogPostQueryDto } from '../../application/dtos/blog-post-query.dto';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from '../../application/dtos/blog-post.dto';
import { BlogPostResponseDto } from '../../application/dtos/response/blog-post.response.dto';
import { BlogPostService } from '../../application/services/blog-post.service';

@ApiTags('blog-posts')
@Controller('blog/posts')
export class BlogPostController {
  constructor(private readonly postService: BlogPostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog post (Admin)' })
  @Serialize(BlogPostResponseDto)
  create(@Req() req: RequestWithUser, @Body() dto: CreateBlogPostDto) {
    return this.postService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  // @Serialize(BlogPostResponseDto) // Need pagination wrapper
  findAll(@Query() query: BlogPostQueryDto) {
    return this.postService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get blog post by Slug' })
  @Serialize(BlogPostResponseDto)
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post (Admin)' })
  @Serialize(BlogPostResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.postService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post (Admin)' })
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
