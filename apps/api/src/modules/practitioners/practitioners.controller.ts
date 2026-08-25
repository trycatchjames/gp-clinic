import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import {
  CreatePractitionerDto,
  CreateQualificationDto,
  CreateSupervisionDto,
  PractitionerDto,
  ProviderNumberDto,
  QualificationDto,
  SetProviderNumberDto,
  SupervisionDto,
  UpdatePractitionerDto,
} from './practitioners.dto';
import { PractitionersService } from './practitioners.service';

@ApiTags('Practitioners')
@ApiBearerAuth()
@Controller('practices/:practiceId/practitioners')
export class PractitionersController {
  constructor(private readonly practitioners: PractitionersService) {}

  @Get()
  @ApiOperation({ operationId: 'listPractitioners', summary: 'List practitioners' })
  @ApiOkResponse({ type: [PractitionerDto] })
  list(@Param('practiceId') practiceId: string): Promise<PractitionerDto[]> {
    return this.practitioners.list(practiceId);
  }

  @Post()
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'createPractitioner',
    summary: 'Add a practitioner',
    description:
      'A practitioner may exist without a user account — locums and visiting practitioners are billed under but never log in.',
  })
  @ApiOkResponse({ type: PractitionerDto })
  create(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreatePractitionerDto,
  ): Promise<PractitionerDto> {
    return this.practitioners.create(practiceId, userId, dto);
  }

  @Get(':practitionerId')
  @ApiOperation({ operationId: 'getPractitioner', summary: 'Get a practitioner' })
  @ApiOkResponse({ type: PractitionerDto })
  findOne(
    @Param('practiceId') practiceId: string,
    @Param('practitionerId') practitionerId: string,
  ): Promise<PractitionerDto> {
    return this.practitioners.findOne(practiceId, practitionerId);
  }

  @Patch(':practitionerId')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({ operationId: 'updatePractitioner', summary: 'Update a practitioner' })
  @ApiOkResponse({ type: PractitionerDto })
  update(
    @Param('practiceId') practiceId: string,
    @Param('practitionerId') practitionerId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdatePractitionerDto,
  ): Promise<PractitionerDto> {
    return this.practitioners.update(practiceId, practitionerId, userId, dto);
  }

  @Get(':practitionerId/provider-numbers')
  @ApiOperation({
    operationId: 'listProviderNumbers',
    summary: 'Provider numbers per location',
    description:
      'Every location is listed so that a missing provider number is visible rather than absent.',
  })
  @ApiOkResponse({ type: [ProviderNumberDto] })
  listProviderNumbers(
    @Param('practiceId') practiceId: string,
    @Param('practitionerId') practitionerId: string,
  ): Promise<ProviderNumberDto[]> {
    return this.practitioners.getProviderNumbers(practiceId, practitionerId);
  }

  @Put(':practitionerId/provider-numbers')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'setProviderNumber',
    summary: 'Set a provider number for a location',
    description:
      'Medicare provider numbers are issued per practitioner per location. Billing with the wrong one is a rejected claim.',
  })
  @ApiOkResponse({ type: [ProviderNumberDto] })
  setProviderNumber(
    @Param('practiceId') practiceId: string,
    @Param('practitionerId') practitionerId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: SetProviderNumberDto,
  ): Promise<ProviderNumberDto[]> {
    return this.practitioners.setProviderNumber(practiceId, practitionerId, userId, dto);
  }

  @Get(':practitionerId/qualifications')
  @ApiOperation({ operationId: 'listQualifications', summary: 'Qualifications and expiries' })
  @ApiOkResponse({ type: [QualificationDto] })
  listQualifications(
    @Param('practiceId') practiceId: string,
    @Param('practitionerId') practitionerId: string,
  ): Promise<QualificationDto[]> {
    return this.practitioners.listQualifications(practiceId, practitionerId);
  }

  @Post(':practitionerId/qualifications')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'addQualification',
    summary: 'Record a qualification',
    description:
      'Recording GPMHSC-accredited Mental Health Skills Training unlocks MBS items 2715 and 2717 for this practitioner.',
  })
  @ApiOkResponse({ type: [QualificationDto] })
  addQualification(
    @Param('practiceId') practiceId: string,
    @Param('practitionerId') practitionerId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateQualificationDto,
  ): Promise<QualificationDto[]> {
    return this.practitioners.addQualification(practiceId, practitionerId, userId, dto);
  }

  @Put(':practitionerId/supervision')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'setSupervision',
    summary: 'Record a registrar supervision arrangement',
    description: 'A registrar cannot be activated without one. RACGP GP3.1.',
  })
  @ApiOkResponse({ type: SupervisionDto })
  setSupervision(
    @Param('practiceId') practiceId: string,
    @Param('practitionerId') practitionerId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateSupervisionDto,
  ): Promise<SupervisionDto> {
    return this.practitioners.setSupervision(practiceId, practitionerId, userId, dto);
  }
}
