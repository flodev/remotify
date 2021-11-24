import { IsNotEmpty } from 'class-validator';

export class RefreshToken {
  @IsNotEmpty({ message: 'The refresh token is required' })
  readonly refreshToken: string;
}
