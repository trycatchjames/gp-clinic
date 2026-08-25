import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { sql as raw } from 'drizzle-orm';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import { Public } from '../../common/decorators';

export class HealthDto {
  @ApiProperty({ example: 'ok' }) status: string;
  @ApiProperty({ example: 'ok' }) database: string;
  @ApiProperty() timestamp: string;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  @Public()
  @Get()
  @ApiOperation({ operationId: 'getHealth', summary: 'Liveness and database connectivity' })
  @ApiOkResponse({ type: HealthDto })
  async health(): Promise<HealthDto> {
    let database = 'ok';
    try {
      await this.db.execute(raw`select 1`);
    } catch {
      database = 'unavailable';
    }
    return { status: 'ok', database, timestamp: new Date().toISOString() };
  }
}
