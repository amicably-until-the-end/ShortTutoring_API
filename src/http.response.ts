import { ApiProperty } from '@nestjs/swagger';

export class HttpResponse {
  message: string;
  data?: object;

  constructor(message: string, data?: object) {
    this.message = message;
    this.data = data;
  }
}

export class Success extends HttpResponse {
  @ApiProperty({
    example: 'OK',
  })
  message: string;

  constructor(message: string, data?: object) {
    super(message, data);
  }
}

export class Created extends HttpResponse {
  @ApiProperty({
    example: 'Created',
  })
  message: string;

  constructor(message: string, data?: object) {
    super(message, data);
  }
}

export class BadRequest extends HttpResponse {
  @ApiProperty({
    example: 'Bad Request',
  })
  message: string;

  constructor(message: string) {
    super(message);
  }
}

export class Unauthorized extends HttpResponse {
  @ApiProperty({
    example: 'Unauthorized',
  })
  message: string;

  constructor(message: string) {
    super(message);
  }
}

export class Forbidden extends HttpResponse {
  @ApiProperty({
    example: 'Forbidden',
  })
  message: string;

  constructor(message: string) {
    super(message);
  }
}

export class NotFound extends HttpResponse {
  @ApiProperty({
    example: 'Not Found',
  })
  message: string;

  constructor(message: string) {
    super(message);
  }
}

export class Conflict extends HttpResponse {
  @ApiProperty({
    example: 'Conflict',
  })
  message: string;

  constructor(message: string) {
    super(message);
  }
}
