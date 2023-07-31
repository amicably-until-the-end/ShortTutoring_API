export class AccessToken {
  static authorization(headers: Headers) {
    return { vendor: headers['vendor'], accessToken: headers['authorization'] };
  }

  static userKey(headers: Headers) {
    return { vendor: headers['vendor'], userId: headers['userId'] };
  }
}
