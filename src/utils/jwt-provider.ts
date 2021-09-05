import { sign, SignOptions } from "jsonwebtoken";

export class JwtProvider {
  public generateToken(payload: string | object | Buffer, options?: SignOptions): string {
    const secret: string = process.env.TOKEN_SECRET;
    return sign(payload, secret, options);
  }
}