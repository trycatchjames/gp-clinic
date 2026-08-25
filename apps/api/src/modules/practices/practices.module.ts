import { Module } from '@nestjs/common';
import { PracticeSeedService } from './practice-seed.service';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
  controllers: [PracticesController],
  providers: [PracticesService, PracticeSeedService],
  exports: [PracticesService, PracticeSeedService],
})
export class PracticesModule {}
