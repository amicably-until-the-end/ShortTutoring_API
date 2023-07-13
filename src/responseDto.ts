import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  statusCode?: number;
  message: string;
  error: boolean;
  data?: object;

  constructor(
    statusCode: number,
    message: string,
    error: boolean,
    data?: object,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.data = data;
  }
}

export class BadRequestDto extends ResponseDto {
  @ApiProperty({
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  error: boolean;

  constructor(message: string) {
    super(400, message, true);
  }
}

export class UnauthorizedDto extends ResponseDto {
  @ApiProperty({
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  error: boolean;

  constructor(message: string) {
    super(401, message, true);
  }
}

export class ForbiddenDto extends ResponseDto {
  @ApiProperty({
    example: 403,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Forbidden',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  error: boolean;

  constructor(message: string) {
    super(403, message, true);
  }
}

export class NotFoundDto extends ResponseDto {
  @ApiProperty({
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Not Found',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  error: boolean;

  constructor(message: string) {
    super(404, message, true);
  }
}

export class ConflictDto extends ResponseDto {
  @ApiProperty({
    example: 409,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Conflict',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  error: boolean;

  constructor(message: string) {
    super(409, message, true);
  }
}
