import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import {
  CreateUserDto,
  GetAllUsersQueryDto,
  UpdateUserDto,
  UpdateUserImageDto,
} from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { Protected, Roles } from '@decorators';
import { UserRoles } from './enums';
import { CheckFileSizePipe } from './pipes';

@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @ApiOperation({ summary: 'get all users' })
  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async getAll(@Query() queries: GetAllUsersQueryDto) {
    return await this.service.getAll(queries);
  }

  @ApiOperation({ summary: 'create user' })
  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async create(@Body() payload: CreateUserDto) {
    return await this.service.create(payload);
  }

  @ApiOperation({ summary: 'update user' })
  @Patch(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async update(
    @Body() payload: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.service.update(id, payload);
  }

  @ApiOperation({ summary: 'add and update user image' })
  @ApiConsumes('multipart/form-data')
  @Put(':id/image')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @UseInterceptors(FileInterceptor('image'))
  async updateUserImage(
    @Body() payload: UpdateUserImageDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new CheckFileSizePipe(1)) image: Express.Multer.File,
  ) {
    return await this.service.updateImage(id, { image });
  }

  @ApiOperation({ summary: "delete user" })
  @Delete(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
