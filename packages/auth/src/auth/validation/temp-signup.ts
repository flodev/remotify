import { IsIn, IsNotEmpty, ValidateIf } from 'class-validator';

export class TempSignup {
  @IsNotEmpty()
  @IsIn(['invitation', 'temporary'])
  type: string;

  @ValidateIf((o) => o.otherProperty === 'temporary')
  @IsNotEmpty()
  inviteId: string;
}
