import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Public, Roles } from '../../common/decorators';
import {
  FeeScheduleDto,
  FeeScheduleItemDto,
  MbsItemDto,
  UpdateFeeScheduleItemDto,
} from './billing.dto';
import { BillingService } from './billing.service';

@ApiTags('Billing')
@ApiBearerAuth()
@Controller()
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('practices/:practiceId/fee-schedules')
  @ApiOperation({ operationId: 'listFeeSchedules', summary: 'List fee schedules' })
  @ApiOkResponse({ type: [FeeScheduleDto] })
  listSchedules(@Param('practiceId') practiceId: string): Promise<FeeScheduleDto[]> {
    return this.billing.listFeeSchedules(practiceId);
  }

  @Get('practices/:practiceId/fee-schedules/:scheduleId/items')
  @ApiOperation({
    operationId: 'listFeeScheduleItems',
    summary: 'Priced items in a fee schedule',
    description: 'Each row carries the fee, the Medicare benefit and the resulting patient gap.',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Item number or description.' })
  @ApiOkResponse({ type: [FeeScheduleItemDto] })
  listItems(
    @Param('practiceId') practiceId: string,
    @Param('scheduleId') scheduleId: string,
    @Query('search') search?: string,
  ): Promise<FeeScheduleItemDto[]> {
    return this.billing.listFeeScheduleItems(practiceId, scheduleId, search);
  }

  @Patch('practices/:practiceId/fee-schedules/:scheduleId/items/:itemId')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'updateFeeScheduleItem',
    summary: 'Change a fee',
    description: 'The Bulk Bill and DVA schedules are locked to their external schedules.',
  })
  @ApiOkResponse({ type: FeeScheduleItemDto })
  updateItem(
    @Param('practiceId') practiceId: string,
    @Param('scheduleId') scheduleId: string,
    @Param('itemId') itemId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateFeeScheduleItemDto,
  ): Promise<FeeScheduleItemDto> {
    return this.billing.updateFeeScheduleItem(practiceId, scheduleId, itemId, userId, dto);
  }

  @Public()
  @Get('mbs-items')
  @ApiOperation({
    operationId: 'listMbsItems',
    summary: 'The MBS reference catalogue',
    description:
      'A working subset sufficient to demonstrate the billing workflows. Not an authoritative MBS.',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Item number or description.' })
  @ApiQuery({ name: 'group', required: false, description: 'Restrict to one MBS group.' })
  @ApiOkResponse({ type: [MbsItemDto] })
  listMbsItems(
    @Query('search') search?: string,
    @Query('group') group?: string,
  ): Promise<MbsItemDto[]> {
    return this.billing.listMbsItems(search, group);
  }
}
