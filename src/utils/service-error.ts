export class ServiceError {
  public readonly status: number;
  public readonly message: string;

  public constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}