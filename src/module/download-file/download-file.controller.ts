import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DownloadFileService } from '@/module/download-file/download-file.service';
import { AuthGuard } from '@nestjs/passport';
import { DownloadFileInfoDto } from '@/module/download-file/dto/download-file.dto';

// import * as fs from 'fs';
// import * as md5 from 'md5';

@Controller('download-file')
export class DownloadFileController {
  private readonly logger = new Logger(DownloadFileController.name);

  constructor(
    private downloadFileService: DownloadFileService,
    private configService: ConfigService,
  ) {}

  @Post('/info')
  // @UseGuards(AuthGuard('api-key'))
  async downloadInfo(@Body() dto: DownloadFileInfoDto) {
    this.logger.log(`${JSON.stringify(dto)}`);
    this.logger.log(`${dto.key1}`);
    this.logger.log(`${dto.key2}`);

    // url 리스트 배열로 보낸다
    const urlList = [];

    urlList.push({
      filePath: 'patch/text01.txt',
      checksum: 'cb08ca4a7bb5f9683c19133a84872ca7',
      updateStatus: true,
    });
    urlList.push({
      filePath: 'patch/text02.txt',
      checksum: 'f38c26a09c89158123f77b474221cc8a',
      updateStatus: true,
    });
    urlList.push({
      filePath: 'patch/text03.txt',
      checksum: 'cdd50a3cc4c11350b4f7a97b9c83b569',
      updateStatus: true,
    });

    // urlList.push({
    //   filePath: 'image-15/image_15.bin',
    //   checksum: 'a34ee55dbb3aa4ac993eb7454b1f4d15',
    //   updateStatus: true,
    // });
    // urlList.push({
    //   filePath: 'image-12/image_12.bin',
    //   checksum: 'a34ee55dbb3aa4ac993eb7454b1f4d15',
    //   updateStatus: true,
    // });
    // urlList.push({
    //   filePath: 'image-11/image_11.bin',
    //   checksum: 'a34ee55dbb3aa4ac993eb7454b1f4d15',
    //   updateStatus: true,
    // });
    // urlList.push({
    //   filePath: 'image-10/image_10.bin',
    //   checksum: 'cb3fffcc0e7c5b2874c639a4107b3a6a',
    // });
    // urlList.push({
    //   filePath: 'image-09/image_09.bin',
    //   checksum: '30eb7e71f05abc3a12ce3fcd589debd6',
    // });
    // urlList.push({
    //   filePath: 'image-08/image_08.bin',
    //   checksum: '38db288725fa54ccbf0b92a39e69b78a',
    // });
    // urlList.push({
    //   filePath: 'image-07/image_07.bin',
    //   checksum: '15d24a1d77ccd2f3983a09dec2374004',
    // });
    // urlList.push({
    //   filePath: 'image-06/image_06.bin',
    //   checksum: '1f7e5a19cb4ace806a37cd72f3cb6172',
    // });

    // crypto.createHash('md5').update(data).digest('hex');
    // fs.readFile('/asset_uploads/image-15/image_15.bin', function (err, buf) {
    //   const v = buf;
    //   console.log(md5(v));
    // });

    // fs.readFileAsync(
    //   // __dirname + '/asset_uploads/image-15/image_15.bin',
    //   // 'D:\\LDK_Work\\Source\\__00_Project\\asset-file-server\\asset_uploads\\image-15\\image_15.bin',
    //   'D:\\LDK_Work\\Source\\__00_Project\\asset-file-server\\asset_uploads\\newest.txt',
    //   'utf8',
    //   function (err, data) {
    //     if (err) throw err;

    //     console.log(md5(data));
    //   },
    // );

    return Object.assign({
      resultCode: 0,
      resultMessage: 'Success',
      resultData: urlList,
    });
  }
}
