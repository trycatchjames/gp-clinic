import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import {
  AppointmentTypeDto,
  CreateAppointmentTypeDto,
  CreateSessionTemplateDto,
  SessionTemplateDto,
  UpdateAppointmentTypeDto,
} from './appointment-types.dto';
import { AppointmentTypesService } from './appointment-types.service';

@ApiTags('Appointment types')
@ApiBearerAuth()
@Controller('practices/:practiceId')
export class AppointmentTypesController {
  constructor(private readonly service: AppointmentTypesService) {}

  @Get('appointment-types')
  @ApiOperation({ operationId: 'listAppointmentTypes', summary: 'List appointment types' })
  @ApiOkResponse({ type: [AppointmentTypeDto] })
  list(@Param('practiceId') practiceId: string): Promise<AppointmentTypeDto[]> {
    return this.service.list(practiceId);
  }

  @Post('appointment-types')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'createAppointmentType',
    summary: 'Create an appointment type',
    description:
      'The default MBS item is a suggestion used to pre-fill billing. Nothing bills automatically.',
  })
  @ApiOkResponse({ type: AppointmentTypeDto })
  create(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateAppointmentTypeDto,
  ): Promise<AppointmentTypeDto> {
    return this.service.create(practiceId, userId, dto);
  }

  @Patch('appointment-types/:typeId')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({ operationId: 'updateAppointmentType', summary: 'Update an appointment type' })
  @ApiOkResponse({ type: AppointmentTypeDto })
  update(
    @Param('practiceId') practiceId: string,
    @Param('typeId') typeId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateAppointmentTypeDto,
  ): Promise<AppointmentTypeDto> {
    return this.service.update(practiceId, typeId, userId, dto);
  }

  @Delete('appointment-types/:typeId')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'deactivateAppointmentType',
    summary: 'Deactivate an appointment type',
    description: 'Types in use are deactivated, never deleted, so history keeps its meaning.',
  })
  @ApiOkResponse({ type: AppointmentTypeDto })
  deactivate(
    @Param('practiceId') practiceId: string,
    @Param('typeId') typeId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<AppointmentTypeDto> {
    return this.service.deactivate(practiceId, typeId, userId);
  }

  @Get('session-templates')
  @ApiOperation({
    operationId: 'listSessionTemplates',
    summary: 'Practitioner availability, per location and day',
  })
  @ApiOkResponse({ type: [SessionTemplateDto] })
  listSessions(@Param('practiceId') practiceId: string): Promise<SessionTemplateDto[]> {
    return this.service.listSessions(practiceId);
  }

  @Post('session-templates')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'createSessionTemplate',
    summary: 'Add a recurring session',
    description:
      'A session is a window with a slot size, not a list of pre-cut slots — so a 30-minute appointment consumes two 15-minute slots.',
  })
  @ApiOkResponse({ type: [SessionTemplateDto] })
  createSession(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateSessionTemplateDto,
  ): Promise<SessionTemplateDto[]> {
    return this.service.createSession(practiceId, userId, dto);
  }

  @Delete('session-templates/:sessionId')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({ operationId: 'deleteSessionTemplate', summary: 'Remove a session' })
  @ApiOkResponse({ type: [SessionTemplateDto] })
  deleteSession(
    @Param('practiceId') practiceId: string,
    @Param('sessionId') sessionId: string,
  ): Promise<SessionTemplateDto[]> {
    return this.service.deleteSession(practiceId, sessionId);
  }
}
