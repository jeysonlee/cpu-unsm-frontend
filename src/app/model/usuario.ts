import { Rol } from './rol';

export class Usuario {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  rol?: Rol; // ahora es un objeto Rol
  is2faEnabled?: boolean;
  secret2fa?: string | null;
  code2fa?: string | null;
  code2faExpiration?: Date | null;
  createdAt?: Date;
  enabled?: boolean;
  credentialsNonExpired?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
}
