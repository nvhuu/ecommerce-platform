export class User {
  id!: string;
  email!: string;
  password!: string;
  role!: Role;
  createdAt!: Date;
  updatedAt!: Date;
}

export enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
}
