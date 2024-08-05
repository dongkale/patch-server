import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatchController } from '@/module/patch/patch.controller';
import { PatchService } from '@/patch/patch.service';
import { Patch } from '@/patch/patch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patch])],
  controllers: [PatchController],
  providers: [PatchService],
})
export class PatchModule {}
