import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^(?!.*<[^>]+>).+$/, {
    message: 'Email should not contain HTML tags',
  })
  email: string;
}
