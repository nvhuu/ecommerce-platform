import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFolderDto } from '../../application/dtos/media.dto';
import { MediaService } from '../../application/services/media.service';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'List media files and folders' })
  @ApiQuery({ name: 'folderId', required: false, type: String })
  async getMedia(@Query('folderId') folderId?: string) {
    return this.mediaService.findAll(folderId);
  }

  @Post('folder')
  @ApiOperation({ summary: 'Create a new folder' })
  async createFolder(
    @Body() createFolderDto: CreateFolderDto,
    @Req() req: RequestWithUser,
  ) {
    return this.mediaService.createFolder(createFolderDto, req.user.id);
  }

  @Delete(':type/:id')
  @ApiOperation({ summary: 'Delete file or folder' })
  async deleteMedia(
    @Param('type') type: 'file' | 'folder',
    @Param('id') id: string,
  ) {
    return this.mediaService.delete(id, type);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file (image/video)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folderId: {
          type: 'string',
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Req() req: RequestWithUser,
    @Body('folderId') folderId?: string,
  ) {
    return this.mediaService.uploadFile(file, req.user.id, folderId);
  }
}
