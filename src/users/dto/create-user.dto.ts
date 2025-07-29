export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: string; // e.g., 'soldier' or 'commander'
}
