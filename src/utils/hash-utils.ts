import { genSalt, hash, compare } from 'bcrypt';
import { UserSecret } from 'src/modules/core/user-secrets/entities/user-secret.entity';

export const generateSalt = async (rounds: number = 10): Promise<string> => await genSalt(rounds);

export const generateHash = async (value: string, salt: string): Promise<string> => await hash(value, salt);

export const compareHash = async (plainText: string, hash: string): Promise<boolean> => await compare(plainText, hash);

export const generateUserSecret = async (userId: number, password: string): Promise<UserSecret> => {
  const salt: string = await generateSalt();
  const hash: string = await generateHash(password, salt);

  return new UserSecret({
    password: hash,
    salt,
    userId
  });
};