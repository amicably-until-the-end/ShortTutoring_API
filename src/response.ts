export class Response {
  message: string;
  success: boolean;
  data?: object;
  errorCode?: number;

  constructor(
    message: string,
    success: boolean,
    data?: object,
    errorCode?: number,
  ) {
    this.message = message;
    this.success = success;
    this.data = data;
    this.errorCode = errorCode;
  }
}

export class Success extends Response {
  constructor(message: string, data?: object) {
    super(message, true, data);
  }
}

export class Fail extends Response {
  constructor(message: string, errorCode?: number) {
    if (errorCode) super(message, false, undefined, errorCode);
    else super(message, false);
  }
}
