import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public, type AuthenticatedUser } from '../../common/decorators';
import {
  AcceptInvitationDto,
  AuthTokensDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  SessionUserDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: 'register',
    summary: 'Create an account',
    description:
      'Creates a user account with no practice. The next step is to create a practice or accept an invitation.',
  })
  @ApiOkResponse({ type: AuthTokensDto })
  register(@Body() dto: RegisterDto): Promise<AuthTokensDto> {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'login', summary: 'Sign in' })
  @ApiOkResponse({ type: AuthTokensDto })
  login(@Body() dto: LoginDto): Promise<AuthTokensDto> {
    return this.auth.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'refreshSession',
    summary: 'Exchange a refresh token for a new access token',
    description:
      'Refresh tokens rotate on use. Presenting a consumed token revokes the whole token family.',
  })
  @ApiOkResponse({ type: AuthTokensDto })
  refresh(@Body() dto: RefreshDto): Promise<AuthTokensDto> {
    return this.auth.refresh(dto.refreshToken);
  }

  @Public()
  @Post('accept-invitation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'acceptInvitation',
    summary: 'Accept an invitation to join a practice',
  })
  @ApiOkResponse({ type: AuthTokensDto })
  acceptInvitation(@Body() dto: AcceptInvitationDto): Promise<AuthTokensDto> {
    return this.auth.acceptInvitation(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ operationId: 'logout', summary: 'Revoke all sessions for this user' })
  logout(@CurrentUser('userId') userId: string): Promise<void> {
    return this.auth.logout(userId);
  }

  @Get('me')
  @ApiOperation({ operationId: 'getCurrentUser', summary: 'The signed-in user and their practice' })
  @ApiOkResponse({ type: SessionUserDto })
  me(@CurrentUser() user: AuthenticatedUser): Promise<SessionUserDto> {
    return this.auth.currentUser(user.userId);
  }
}
