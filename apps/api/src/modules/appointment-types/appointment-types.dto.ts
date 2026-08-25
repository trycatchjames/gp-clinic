import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DAYS_OF_WEEK, PRACTITIONER_KINDS } from '@gp/contracts';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

export class AppointmentTypeDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() shortCode: string;
  @ApiProperty() durationMinutes: number;
  @ApiProperty() colour: string;
  @ApiPropertyOptional({ type: String, nullable: true }) description: string | null;
  @ApiProperty({ type: [String], enum: PRACTITIONER_KINDS })
  allowedPractitionerKinds: string[];
  @ApiProperty() onlineBookable: boolean;
  @ApiProperty() newPatientsAllowed: boolean;
  @ApiProperty() doubleBookingAllowed: boolean;
  @ApiProperty({
    description: 'Fires the reception red-flag script and blocks online booking.',
  })
  requiresTriagePrompt: boolean;
  @ApiPropertyOptional({ type: Number, nullable: true }) minNoticeMinutes: number | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) maxAdvanceDays: number | null;
  @ApiPropertyOptional({ type: String, nullable: true,
    description: 'A suggestion at billing only. Nothing bills automatically.', })
  defaultMbsItemNumber: string | null;
  @ApiProperty() isActive: boolean;
  @ApiProperty() sortOrder: number;
}

export class CreateAppointmentTypeDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() shortCode: string;
  @ApiProperty({ example: 15 }) @IsInt() @Min(5) durationMinutes: number;
  @ApiProperty({ example: '#2563eb' }) @IsString() colour: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ type: [String], enum: PRACTITIONER_KINDS })
  @IsOptional()
  @IsArray()
  allowedPractitionerKinds?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() onlineBookable?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() newPatientsAllowed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() doubleBookingAllowed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requiresTriagePrompt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() minNoticeMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxAdvanceDays?: number;
  @ApiPropertyOptional({ example: '23' })
  @IsOptional()
  @IsString()
  defaultMbsItemNumber?: string;
}

export class UpdateAppointmentTypeDto extends CreateAppointmentTypeDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

export class SessionTemplateDto {
  @ApiProperty() id: string;
  @ApiProperty() practitionerId: string;
  @ApiProperty() practitionerName: string;
  @ApiProperty() locationId: string;
  @ApiProperty() locationName: string;
  @ApiProperty({ enum: DAYS_OF_WEEK }) dayOfWeek: string;
  @ApiProperty({ example: '08:30' }) startsAt: string;
  @ApiProperty({ example: '12:30' }) endsAt: string;
  @ApiProperty() slotMinutes: number;
  @ApiProperty() onlineBookable: boolean;
  @ApiProperty() isActive: boolean;
  @ApiProperty({ description: 'Number of bookable slots this session provides.' })
  slotCount: number;
}

export class CreateSessionTemplateDto {
  @ApiProperty() @IsUUID() practitionerId: string;
  @ApiProperty() @IsUUID() locationId: string;
  @ApiProperty({ enum: DAYS_OF_WEEK })
  @IsIn(DAYS_OF_WEEK as unknown as string[])
  dayOfWeek: string;
  @ApiProperty({ example: '08:30' }) @Matches(/^\d{2}:\d{2}$/) startsAt: string;
  @ApiProperty({ example: '12:30' }) @Matches(/^\d{2}:\d{2}$/) endsAt: string;
  @ApiPropertyOptional({ example: 15, default: 15 })
  @IsOptional()
  @IsInt()
  @Min(5)
  slotMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() onlineBookable?: boolean;
  @ApiPropertyOptional({
    description: 'Required when the session extends beyond the location’s opening hours.',
  })
  @IsOptional()
  @IsString()
  outsideOpeningHoursReason?: string;
}
