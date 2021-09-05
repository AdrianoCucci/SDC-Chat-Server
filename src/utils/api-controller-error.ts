export class ApiControllerError {
  public readonly status: number;
  public readonly response?: any;

  public constructor(status: number, response?: any) {
    this.status = status;
    this.response = response;
  }
}