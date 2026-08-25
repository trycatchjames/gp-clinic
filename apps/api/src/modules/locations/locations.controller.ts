import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import {
  BusinessHoursDayDto,
  CreateLocationDto,
  LocationDto,
  SetBusinessHoursDto,
  UpdateLocationDto,
} from './locations.dto';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@ApiBearerAuth()
@Controller('practices/:practiceId/locations')
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}

  @Get()
  @ApiOperation({ operationId: 'listLocations', summary: 'List practice locations' })
  @ApiOkResponse({ type: [LocationDto] })
  list(@Param('practiceId') practiceId: string): Promise<LocationDto[]> {
    return this.locations.list(practiceId);
  }

  @Post()
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'createLocation',
    summary: 'Add a location',
    description:
      'Provider numbers, appointment books, banking and fee schedules are all scoped to a location.',
  })
  @ApiOkResponse({ type: LocationDto })
  create(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateLocationDto,
  ): Promise<LocationDto> {
    return this.locations.create(practiceId, userId, dto);
  }

  @Get(':locationId')
  @ApiOperation({ operationId: 'getLocation', summary: 'Get a location' })
  @ApiOkResponse({ type: LocationDto })
  findOne(
    @Param('practiceId') practiceId: string,
    @Param('locationId') locationId: string,
  ): Promise<LocationDto> {
    return this.locations.findOne(practiceId, locationId);
  }

  @Patch(':locationId')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'updateLocation',
    summary: 'Update a location',
    description:
      'Deactivation is blocked while future appointments remain. Changing the timezone does not move existing appointments — only how they are displayed.',
  })
  @ApiOkResponse({ type: LocationDto })
  update(
    @Param('practiceId') practiceId: string,
    @Param('locationId') locationId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateLocationDto,
  ): Promise<LocationDto> {
    return this.locations.update(practiceId, locationId, userId, dto);
  }

  @Get(':locationId/business-hours')
  @ApiOperation({ operationId: 'getBusinessHours', summary: 'Opening hours for a location' })
  @ApiOkResponse({ type: [BusinessHoursDayDto] })
  getHours(
    @Param('practiceId') practiceId: string,
    @Param('locationId') locationId: string,
  ): Promise<BusinessHoursDayDto[]> {
    return this.locations.getBusinessHours(practiceId, locationId);
  }

  @Put(':locationId/business-hours')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'setBusinessHours',
    summary: 'Set opening hours',
    description: 'RACGP C1.1 requires patients to be told when the practice is open.',
  })
  @ApiOkResponse({ type: [BusinessHoursDayDto] })
  setHours(
    @Param('practiceId') practiceId: string,
    @Param('locationId') locationId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: SetBusinessHoursDto,
  ): Promise<BusinessHoursDayDto[]> {
    return this.locations.setBusinessHours(practiceId, locationId, userId, dto);
  }
}
