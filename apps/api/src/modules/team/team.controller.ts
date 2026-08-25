import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import {
  InvitationDto,
  InviteMemberDto,
  MemberDto,
  OffboardingChecklistDto,
  UpdateMemberRoleDto,
} from './team.dto';
import { TeamService } from './team.service';

@ApiTags('Team')
@ApiBearerAuth()
@Controller('practices/:practiceId/team')
export class TeamController {
  constructor(private readonly team: TeamService) {}

  @Get('members')
  @ApiOperation({ operationId: 'listMembers', summary: 'List practice members' })
  @ApiOkResponse({ type: [MemberDto] })
  listMembers(@Param('practiceId') practiceId: string): Promise<MemberDto[]> {
    return this.team.listMembers(practiceId);
  }

  @Patch('members/:memberId/role')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'updateMemberRole',
    summary: 'Change a member’s role',
    description: 'A practice must always have at least one active owner.',
  })
  @ApiOkResponse({ type: MemberDto })
  updateRole(
    @Param('practiceId') practiceId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
  ): Promise<MemberDto> {
    return this.team.updateRole(practiceId, memberId, userId, dto);
  }

  @Get('members/:memberId/offboarding')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'getOffboardingChecklist',
    summary: 'What needs a new owner before this person leaves',
    description:
      'Unactioned results and open recalls block removal — an orphaned result is a safety event.',
  })
  @ApiOkResponse({ type: OffboardingChecklistDto })
  offboarding(
    @Param('practiceId') practiceId: string,
    @Param('memberId') memberId: string,
  ): Promise<OffboardingChecklistDto> {
    return this.team.getOffboardingChecklist(practiceId, memberId);
  }

  @Delete('members/:memberId')
  @Roles('practice_owner', 'practice_manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'removeMember',
    summary: 'Remove a member',
    description:
      'Deactivates the membership and revokes sessions. Records they authored are untouched.',
  })
  remove(
    @Param('practiceId') practiceId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.team.removeMember(practiceId, memberId, userId);
  }

  @Get('invitations')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({ operationId: 'listInvitations', summary: 'List invitations' })
  @ApiOkResponse({ type: [InvitationDto] })
  listInvitations(@Param('practiceId') practiceId: string): Promise<InvitationDto[]> {
    return this.team.listInvitations(practiceId);
  }

  @Post('invitations')
  @Roles('practice_owner', 'practice_manager')
  @ApiOperation({
    operationId: 'inviteMember',
    summary: 'Invite someone to the practice',
    description:
      'Single-use token, expires in 14 days. The prototype returns the accept URL instead of sending email.',
  })
  @ApiOkResponse({ type: InvitationDto })
  invite(
    @Param('practiceId') practiceId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: InviteMemberDto,
  ): Promise<InvitationDto> {
    return this.team.invite(practiceId, userId, dto);
  }

  @Delete('invitations/:invitationId')
  @Roles('practice_owner', 'practice_manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ operationId: 'revokeInvitation', summary: 'Revoke a pending invitation' })
  revoke(
    @Param('practiceId') practiceId: string,
    @Param('invitationId') invitationId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.team.revokeInvitation(practiceId, invitationId, userId);
  }
}
