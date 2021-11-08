import { genSalt, hash } from 'bcrypt';

export const generateSalt = async (rounds: number = 10): Promise<string> => await genSalt(rounds);

export const computeHash = async (value: string, salt: string): Promise<string> => await hash(value, salt);