import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import {
  BillingSettingsDto,
  CompleteStepDto,
  CreatePracticeDto,
  OnboardingStatusDto,
  PracticeDto,
  PracticeRegistrationsDto,
  UpdateBillingSettingsDto,
  UpdatePracticeDto,
  UpdateRegistrationsDto,
} from './practices.dto';
import { PracticesService } from './practices.service';

@ApiTags('Practices')
@ApiBearerAuth()
@Controller('practices')
export class PracticesController {
  constructor(private readonly practices: PracticesService) {}

  @Post()
  @ApiOperation({
    operationId: 'createPractice',
    summary: 'Register a new practice',
    description:
      'Creates the practice in onboarding, makes the caller its owner, and seeds default appointment types, fee schedules and triage prompts.',
  })
  @ApiOkResponse({ type: PracticeDto })
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreatePracticeDto,
  ): Promise<PracticeDto> {
    return this.practices.create(userId, dto);
  }

  @Get(':practiceId')
  @ApiOperation({ operationId: 'getPractice', summary: 'Get a practice' })
  @ApiOkResponse({ type: PracticeDto })
  findOne(@Param('practiceId') practiceId: string): Promise<PracticeDto> {
    return this.practices.findOne(practiceId);
  }

  @Patch(':practiceId')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({ operationId: 'updatePractice', summary: 'Update practice identity' })
  @ApiOkResponse({ type: PracticeDto })
  update(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdatePracticeDto,
  ): Promise<PracticeDto> {
    return this.practices.update(practiceId, userId, dto);
  }

  @Get(':practiceId/registrations')
  @ApiOperation({
    operationId: 'getPracticeRegistrations',
    summary: 'Programme registrations and identifiers',
  })
  @ApiOkResponse({ type: PracticeRegistrationsDto })
  getRegistrations(@Param('practiceId') practiceId: string): Promise<PracticeRegistrationsDto> {
    return this.practices.getRegistrations(practiceId);
  }

  @Put(':practiceId/registrations')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'updatePracticeRegistrations',
    summary: 'Update registrations and identifiers',
    description:
      'BBPIP participation requires MyMedicare registration and sets the billing policy to bulk_bill_all.',
  })
  @ApiOkResponse({ type: PracticeRegistrationsDto })
  updateRegistrations(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateRegistrationsDto,
  ): Promise<PracticeRegistrationsDto> {
    return this.practices.updateRegistrations(practiceId, userId, dto);
  }

  @Get(':practiceId/billing-settings')
  @ApiOperation({ operationId: 'getBillingSettings', summary: 'Practice billing policy' })
  @ApiOkResponse({ type: BillingSettingsDto })
  getBillingSettings(@Param('practiceId') practiceId: string): Promise<BillingSettingsDto> {
    return this.practices.getBillingSettings(practiceId);
  }

  @Put(':practiceId/billing-settings')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'updateBillingSettings',
    summary: 'Update billing policy and private fee generation',
  })
  @ApiOkResponse({ type: BillingSettingsDto })
  updateBillingSettings(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateBillingSettingsDto,
  ): Promise<BillingSettingsDto> {
    return this.practices.updateBillingSettings(practiceId, userId, dto);
  }

  @Get(':practiceId/onboarding')
  @ApiOperation({
    operationId: 'getOnboardingStatus',
    summary: 'Onboarding steps and the activation checklist',
  })
  @ApiOkResponse({ type: OnboardingStatusDto })
  getOnboarding(@Param('practiceId') practiceId: string): Promise<OnboardingStatusDto> {
    return this.practices.getOnboardingStatus(practiceId);
  }

  @Put(':practiceId/onboarding/steps/:step')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'setOnboardingStep',
    summary: 'Mark an onboarding step complete',
    description: 'Progress is saved on every step transition so the wizard is resumable.',
  })
  @ApiOkResponse({ type: OnboardingStatusDto })
  setStep(
    @Param('practiceId') practiceId: string,
    @Param('step') step: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CompleteStepDto,
  ): Promise<OnboardingStatusDto> {
    return this.practices.setStepStatus(practiceId, step, dto.status ?? 'complete', userId);
  }

  @Post(':practiceId/activate')
  @Roles('practice_owner')
  @ApiOperation({
    operationId: 'activatePractice',
    summary: 'Activate the practice',
    description:
      'Blocked until every required checklist item is satisfied. Recommended items do not block.',
  })
  @ApiOkResponse({ type: PracticeDto })
  activate(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<PracticeDto> {
    return this.practices.activate(practiceId, userId);
  }
}
