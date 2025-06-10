import { User } from '../../domain/models/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export type RegisterUserFn = (
  userData: User,
  userRepository: UserRepository
) => Promise<User>;
