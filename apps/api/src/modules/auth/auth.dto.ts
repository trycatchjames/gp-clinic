import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'anita.raman@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'correct-horse-battery-staple', minLength: 12 })
  @IsString()
  @MinLength(12, { message: 'password must be at least 12 characters' })
  @MaxLength(200)
  password: string;

  @ApiProperty({ example: 'Anita' })
  @IsString()
  @IsNotEmpty()
  givenName: string;

  @ApiProperty({ example: 'Raman' })
  @IsString()
  @IsNotEmpty()
  familyName: string;

  @ApiPropertyOptional({ example: '0412 345 678' })
  @IsOptional()
  @IsString()
  mobile?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'anita.raman@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'correct-horse-battery-staple' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AcceptInvitationDto {
  @ApiProperty({ description: 'The single-use token from the invitation email' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ minLength: 12 })
  @IsString()
  @MinLength(12)
  password: string;
}

export class SessionUserDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() givenName: string;
  @ApiProperty() familyName: string;
  @ApiPropertyOptional({ type: String, nullable: true }) practiceId: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) practiceName: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) role: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) practitionerId: string | null;
  @ApiProperty({ type: [String] }) locationIds: string[];
  @ApiPropertyOptional({ type: String, nullable: true }) onboardingStatus: string | null;
}

export class AuthTokensDto {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
  @ApiProperty({ description: 'Access token lifetime in seconds', example: 900 })
  expiresIn: number;
  @ApiProperty({ type: SessionUserDto }) user: SessionUserDto;
}
