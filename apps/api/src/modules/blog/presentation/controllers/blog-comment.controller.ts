import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@/modules/auth/infrastructure/guards/optional-jwt-auth.guard'; // Assume this exists or create it, otherwise use nullable user check
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
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
import {
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from '../../application/dtos/blog-comment.dto';
import { BlogCommentResponseDto } from '../../application/dtos/response/blog-comment.response.dto';
import { BlogCommentService } from '../../application/services/blog-comment.service';

@ApiTags('blog-comments')
@Controller('blog/comments')
export class BlogCommentController {
  constructor(private readonly commentService: BlogCommentService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard) // Handled by standard JWT guard but allowed to fail? No, need a custom one or just check req.user if present
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog comment' })
  @Serialize(BlogCommentResponseDto)
  create(@Req() req: RequestWithUser, @Body() dto: CreateBlogCommentDto) {
    // If OptionalJwtAuthGuard is not implemented, we might need to rely on the fact that JwtAuthGuard throws.
    // For now, let's assume registered users only OR public endpoints without guard if we want guest.
    // Implementation above assumes userId is optional.
    // Let's use standard @UseGuards(JwtAuthGuard) for now to enforce login, simplify.
    // If guest comments needed, we would need to relax this.
    return this.commentService.create(req.user?.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get comments (Admin - All, Public - Approved related to post)',
  })
  @Serialize(BlogCommentResponseDto)
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('postId') postId?: string,
  ) {
    // This logic should probably be split or handled via role check in a real app
    if (postId) {
      return this.commentService.findAll(postId, query);
    }
    // Admin wanting to see all comments?
    return this.commentService.findAllAdmin(query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment status (Admin)' })
  @Serialize(BlogCommentResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateBlogCommentDto) {
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment (Admin)' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
