import type { LoginCredentials, SignupDetails, User } from '../models/user'

/** Contract used by the application layer to perform authentication actions. */
export interface AuthRepository {
  hasSession(): Promise<boolean>
  login(credentials: LoginCredentials): Promise<User>
  signup(details: SignupDetails): Promise<User>
  profile(): Promise<User>
  logout(): Promise<void>
}
