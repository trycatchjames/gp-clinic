import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PRACTICE_ROLES } from '@gp/contracts';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class MemberDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() email: string;
  @ApiProperty() givenName: string;
  @ApiProperty() familyName: string;
  @ApiProperty({ enum: PRACTICE_ROLES }) role: string;
  @ApiProperty() roleLabel: string;
  @ApiProperty({ enum: ['active', 'suspended', 'removed'] }) status: string;
  @ApiPropertyOptional({ type: String, nullable: true }) practitionerId: string | null;
  @ApiProperty() joinedAt: string;
  @ApiPropertyOptional({ type: String, nullable: true }) lastSignInAt: string | null;
}

export class InviteMemberDto {
  @ApiProperty({ example: 'sarah.kelly@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Sarah' }) @IsString() @IsNotEmpty() givenName: string;
  @ApiProperty({ example: 'Kelly' }) @IsString() @IsNotEmpty() familyName: string;

  @ApiProperty({ enum: PRACTICE_ROLES })
  @IsIn(PRACTICE_ROLES as unknown as string[])
  role: string;

  @ApiPropertyOptional({
    description: 'Link an existing practitioner profile. Required for clinical roles.',
  })
  @IsOptional()
  @IsUUID()
  practitionerId?: string;
}

export class InvitationDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() givenName: string;
  @ApiProperty() familyName: string;
  @ApiProperty({ enum: PRACTICE_ROLES }) role: string;
  @ApiProperty() roleLabel: string;
  @ApiProperty({ enum: ['pending', 'accepted', 'revoked', 'expired'] }) status: string;
  @ApiProperty() expiresAt: string;
  @ApiProperty() createdAt: string;
  @ApiPropertyOptional({ type: String, nullable: true,
    description:
      'The invitation link. Returned once on creation only — the prototype has no email delivery.', })
  acceptUrl?: string | null;
}

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: PRACTICE_ROLES })
  @IsIn(PRACTICE_ROLES as unknown as string[])
  role: string;
}

export class OffboardingChecklistDto {
  @ApiProperty() memberId: string;
  @ApiProperty() displayName: string;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        label: { type: 'string' },
        count: { type: 'number' },
        blocking: { type: 'boolean' },
        resolved: { type: 'boolean' },
      },
    },
  })
  items: {
    key: string;
    label: string;
    count: number;
    blocking: boolean;
    resolved: boolean;
  }[];
  @ApiProperty() canComplete: boolean;
}
