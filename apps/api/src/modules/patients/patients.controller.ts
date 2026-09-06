import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { hasPermission } from '@gp/contracts';
import { CurrentUser, Permissions } from '../../common/decorators';
import type { AuthenticatedUser } from '../../common/decorators';
import { PatientSearchResponseDto } from './patients.dto';
import { PatientsService } from './patients.service';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('practices/:practiceId/patients')
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}

  @Get('search')
  @Permissions('patient.search')
  @ApiOperation({
    operationId: 'searchPatients',
    summary: 'Search for an existing patient',
    description:
      'Returns the administrative result shape only. Never auto-selects a candidate — ' +
      'the receptionist must deliberately choose one. A record carrying an active access ' +
      'restriction is returned as an identity stub unless the caller holds ' +
      'sensitive_record.view, so a restricted patient still prevents a duplicate without ' +
      'disclosing contact, address or entitlement details.',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Name, phone number, Medicare card number or local record number.',
  })
  @ApiQuery({ name: 'dateOfBirth', required: false, description: 'ISO date, YYYY-MM-DD.' })
  @ApiOkResponse({ type: PatientSearchResponseDto })
  search(
    @Param('practiceId') practiceId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('q') q?: string,
    @Query('dateOfBirth') dateOfBirth?: string,
  ): Promise<PatientSearchResponseDto> {
    return this.patients.search(
      practiceId,
      user.userId,
      { q, dateOfBirth },
      hasPermission(user.role, 'sensitive_record.view'),
    );
  }
}
