export class ResponseDto {
  static readonly Success = new ResponseDto(
    200,
    '요청이 성공적으로 처리되었습니다.',
    false,
    null,
  );

  static readonly Created = new ResponseDto(
    201,
    '요청이 성공적으로 처리되었으며, 새로운 자원이 생성되었습니다.',
    false,
    null,
  );

  static readonly BadRequest = new ResponseDto(
    400,
    '요청이 잘못되었습니다.',
    true,
    null,
  );

  static readonly Unauthorized = new ResponseDto(
    401,
    '인증이 필요합니다.',
    true,
    null,
  );

  static readonly Forbidden = new ResponseDto(
    403,
    '권한이 없습니다.',
    true,
    null,
  );

  static readonly NotFound = new ResponseDto(
    404,
    '리소스가 존재하지 않습니다.',
    true,
    null,
  );

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
