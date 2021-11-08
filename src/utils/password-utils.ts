import { genSalt, hash, compare } from 'bcrypt';
import { UserPassword } from 'src/models/auth/user-password';

export const generateSalt = async (rounds: number = 10): Promise<string> => await genSalt(rounds);

export const generateHash = async (value: string, salt: string): Promise<string> => await hash(value, salt);

export const compareHash = async (plainText: string, hash: string): Promise<boolean> => await compare(plainText, hash);

export const generateUserPassword = async (userId: number, password: string): Promise<UserPassword> => {
  const salt: string = await generateSalt();
  const hash: string = await generateHash(password, salt);

  return new UserPassword({
    value: hash,
    salt,
    userId
  });
};