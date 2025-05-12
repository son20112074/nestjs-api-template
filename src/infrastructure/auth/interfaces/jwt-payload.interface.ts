import { Role } from '../../../shared/decorators/roles.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  iat?: number;
  exp?: number;
} 