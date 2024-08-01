import { Module } from '@nestjs/common';
import { DownloadFileController } from '@/module/download-file/download-file.controller';
import { DownloadFileService } from '@/module/download-file/download-file.service';

@Module({
  imports: [],
  controllers: [DownloadFileController],
  providers: [DownloadFileService],
})
export class DownloadFileModule {}
