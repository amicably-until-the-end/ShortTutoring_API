export class AccessToken {
  static authorization(headers: Headers) {
    return {
      vendor: headers['vendor'],
      authorization: headers['authorization'],
    };
  }

  static userKey(headers: Headers) {
    return { vendor: headers['vendor'], userId: headers['userId'] };
  }

  static userId(headers: Headers) {
    return headers['userId'];
  }
}
