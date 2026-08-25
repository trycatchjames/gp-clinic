import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AFTER_HOURS_ARRANGEMENTS,
  AUSTRALIAN_STATES,
  AUSTRALIAN_TIMEZONES,
  DAYS_OF_WEEK,
} from '@gp/contracts';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @ApiProperty({ example: 'Brunswick' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '142 Sydney Road' })
  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @ApiProperty({ example: 'Brunswick' })
  @IsString()
  @IsNotEmpty()
  suburb: string;

  @ApiProperty({ enum: AUSTRALIAN_STATES })
  @IsIn(AUSTRALIAN_STATES as unknown as string[])
  state: string;

  @ApiProperty({ example: '3056' })
  @Matches(/^\d{4}$/, { message: 'postcode must be four digits' })
  postcode: string;

  @ApiProperty({
    enum: AUSTRALIAN_TIMEZONES,
    description: 'Chosen explicitly, not inferred from the state.',
  })
  @IsIn(AUSTRALIAN_TIMEZONES as unknown as string[])
  timezone: string;

  @ApiPropertyOptional() @IsOptional() @IsString() postalAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() afterHoursPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fax?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional({ description: 'Healthcare Provider Identifier — Organisation' })
  @IsOptional()
  @IsString()
  hpiO?: string;
  @ApiPropertyOptional({ description: 'Medicare Minor Customer ID, used for claiming' })
  @IsOptional()
  @IsString()
  medicareMinorId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPrimary?: boolean;
}

export class UpdateLocationDto extends CreateLocationDto {
  @ApiPropertyOptional({ enum: AFTER_HOURS_ARRANGEMENTS })
  @IsOptional()
  @IsIn(AFTER_HOURS_ARRANGEMENTS as unknown as string[])
  afterHoursArrangement?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() afterHoursProviderName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() afterHoursContact?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() afterHoursNotes?: string;

  @ApiPropertyOptional() @IsOptional() @IsBoolean() wheelchairAccess?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() accessibleToilet?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hearingLoop?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() onSiteParking?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() publicTransportNearby?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() treatmentRoom?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() procedureRoom?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() onSitePathologyCollection?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class LocationDto {
  @ApiProperty() id: string;
  @ApiProperty() practiceId: string;
  @ApiProperty() name: string;
  @ApiProperty() isPrimary: boolean;
  @ApiProperty() isActive: boolean;
  @ApiProperty() streetAddress: string;
  @ApiProperty() suburb: string;
  @ApiProperty() state: string;
  @ApiProperty() postcode: string;
  @ApiProperty() timezone: string;
  @ApiPropertyOptional({ type: String, nullable: true }) postalAddress: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) phone: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) afterHoursPhone: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) fax: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) email: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) hpiO: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) medicareMinorId: string | null;
  @ApiPropertyOptional({ type: String, nullable: true, enum: AFTER_HOURS_ARRANGEMENTS })
  afterHoursArrangement: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) afterHoursProviderName: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) afterHoursContact: string | null;
  @ApiProperty() wheelchairAccess: boolean;
  @ApiProperty() accessibleToilet: boolean;
  @ApiProperty() hearingLoop: boolean;
  @ApiProperty() onSiteParking: boolean;
  @ApiProperty() publicTransportNearby: boolean;
  @ApiProperty() treatmentRoom: boolean;
  @ApiProperty() procedureRoom: boolean;
  @ApiProperty() onSitePathologyCollection: boolean;
}

export class BusinessHoursDayDto {
  @ApiProperty({ enum: DAYS_OF_WEEK })
  @IsIn(DAYS_OF_WEEK as unknown as string[])
  dayOfWeek: string;

  @ApiProperty() @IsBoolean() isOpen: boolean;

  @ApiPropertyOptional({ example: '08:30' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  opensAt?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  closesAt?: string;

  @ApiPropertyOptional({ example: '12:30', description: 'Many practices close over lunch.' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  breakStartsAt?: string;

  @ApiPropertyOptional({ example: '14:00' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  breakEndsAt?: string;
}

export class SetBusinessHoursDto {
  @ApiProperty({ type: [BusinessHoursDayDto] })
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDayDto)
  days: BusinessHoursDayDto[];
}
