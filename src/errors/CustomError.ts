class CustomError<C extends string> extends Error {
  private statusCode;
  private code;

  constructor({
    customMessage,
    statusCode,
    code,
  }: {
    customMessage: string;
    statusCode: number;
    code?: C;
  }) {
    super();
    this.message = customMessage;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export default CustomError;
