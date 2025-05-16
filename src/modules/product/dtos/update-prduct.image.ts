import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;
}
