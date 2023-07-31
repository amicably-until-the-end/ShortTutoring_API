export class Response {
  message: string;
  success: boolean;
  data?: object;

  constructor(message: string, success: boolean, data?: object) {
    this.message = message;
    this.success = success;
    this.data = data;
  }
}

export class Success extends Response {
  constructor(message: string, data?: object) {
    super(message, true, data);
  }
}

export class Fail extends Response {
  constructor(message: string) {
    super(message, false);
  }
}
