import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { AuthGuard } from '@nestjs/passport';
import { PatchInfoDto } from '@/patch/dto/patch.dto';
// import { join } from 'path';
// import { createReadStream } from 'fs';
import { Response } from 'express';
import { PatchService } from '@/patch/patch.service';
import { AuthGuard } from '@nestjs/passport';
import { createReadStream, statSync } from 'fs';

@Controller('patch')
export class PatchController {
  private readonly logger = new Logger(PatchController.name);

  constructor(
    private patchService: PatchService,
    private configService: ConfigService,
  ) {}

  @Post('/info')
  @UseGuards(AuthGuard('api-key'))
  async patchInfo(@Body() dto: PatchInfoDto) {
    this.logger.log(`${JSON.stringify(dto)}`);
    this.logger.log(`${dto.key1}`);
    this.logger.log(`${dto.key2}`);

    // // url 리스트 배열로 보낸다
    // const urlList = [];

    // urlList.push({
    //   filePath: 'patch/text01.txt',
    //   checksum: 'cb08ca4a7bb5f9683c19133a84872ca7',
    //   updateStatus: true,
    // });
    // urlList.push({
    //   filePath: 'patch/text02.txt',
    //   checksum: 'f38c26a09c89158123f77b474221cc8a',
    //   updateStatus: true,
    // });
    // urlList.push({
    //   filePath: 'patch/text03.txt',
    //   checksum: 'cdd50a3cc4c11350b4f7a97b9c83b569',
    //   updateStatus: true,
    // });

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

    // const arrayPatchs = [];
    // for (const patch of patchs) {
    //   arrayPatchs.push({
    //     version: patch.version,
    //     filePath: `${patchFileSubPath}/${patch.fileName}`,
    //     checksum: patch.checksum,
    //     forceUpdate: patch.forceUpdate,
    //   });
    // }

    // const patchFileSubPath = this.configService.get(
    //   'PATCH_FILE_DOWNLOAD_SUB_PATH',
    // );

    const patchs = await this.patchService.getPatchs();

    const arrayPatchs = patchs.map((item) => {
      return {
        version: item.version,
        fileName: `${item.fileName}`,
        checksum: item.checksum,
        fileSize: `${item.fileSize}`,
        forceUpdate: item.forceUpdate,
      };
    });

    this.logger.log(`${JSON.stringify(arrayPatchs, null, 2)}`);

    return Object.assign({
      resultCode: 0,
      resultMessage: 'Success',
      resultData: arrayPatchs,
    });
  }

  // https://medium.com/@me9lika.sh/uploading-and-downloading-large-files-with-nodejs-db9e1bf4a8cc
  @Get('/download/:filename')
  // @UseGuards(AuthGuard('api-key'))
  async downloadFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) response: Response, // Response -> import { Response } from 'express';
  ) {
    // const file = await this.patchService.getFileStream(filename);

    // response.setHeader('Content-Type', 'application/json');
    // response.setHeader(
    //   'Content-Disposition',
    //   `attachment; filename="${file.fileName}"`,
    // );

    // response.setHeader('Content-Type', 'application/octet-stream');
    // // response.setHeader('Content-Type', 'application/json');
    // response.setHeader(
    //   'Content-Disposition',
    //   `attachment; filename="${file.fileName}"`,
    // );
    // response.setHeader('Content-Length', file.fileSize.toString());
    // response.setHeader('Cache-Control', 'public, max-age=31536000');

    // // this.logger.log(`downloadPath: ${JSON.stringify(file.fileName, null, 2)}`);

    // return new StreamableFile(file.fileStream);

    // const range = response.req.headers.range;
    // const file = await this.patchService.getFileStream(filename);

    // const total = file.fileSize;
    // const parts = range
    //   ? range.replace(/bytes=/, '').split('-')
    //   : [0, total - 1];
    // const start = parseInt(parts[0] as string, 10);
    // const end = parts[1] ? parseInt(parts[1] as string, 10) : total - 1;

    // if (start >= total || end >= total) {
    //   response.setHeader('Content-Range', `bytes */${total}`);
    //   response.sendStatus(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
    //   return;
    // }

    // response.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    // response.setHeader('Accept-Ranges', 'bytes');
    // response.setHeader('Content-Length', (end - start + 1).toString());
    // response.setHeader('Content-Type', 'application/octet-stream');
    // response.setHeader(
    //   'Content-Disposition',
    //   `attachment; filename="${file.fileName}"`,
    // );

    // const fileStream = createReadStream(file.filePath, { start, end });

    // fileStream.pipe(response);

    // this.logger.log(`downloadPath: ${JSON.stringify(file.fileName, null, 2)}`);

    const range = response.req.headers.range;
    const file = await this.patchService.getFileStream(filename);

    const filePath = file.filePath;
    const fileSize = statSync(filePath).size;
    const parts = range
      ? range.replace(/bytes=/, '').split('-')
      : [0, fileSize - 1];
    const start = parseInt(parts[0] as string, 10);
    const end = parts[1] ? parseInt(parts[1] as string, 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      response.setHeader('Content-Range', `bytes */${fileSize}`);
      response.sendStatus(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
      return;
    }

    const chunkSize = end - start + 1;
    const fileStream = createReadStream(filePath, { start, end });

    response.status(HttpStatus.PARTIAL_CONTENT);
    response.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    response.setHeader('Accept-Ranges', 'bytes');
    response.setHeader('Content-Length', chunkSize.toString());
    response.setHeader('Content-Type', 'application/octet-stream');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName}"`,
    );

    this.logger.log(`downloadPath: ${JSON.stringify(file.fileName, null, 2)}`);

    fileStream.pipe(response);
  }

  // @Get(':filename')
  // @UseGuards(AuthGuard('api-key'))
  // downloadFile(@Param('filename') filename: string, @Res() res: Response) {
  //   const filePath = join(__dirname, '../../public', filename);
  //   const fileStream = createReadStream(filePath);

  //   fileStream.pipe(res);
  // }

  // @Get(':filename')
  // @UseGuards(AuthGuard('api-key'))
  // async downloadFile(
  //   @Param('filename') filename: string,
  //   @Res({ passthrough: true }) response: Response, // Response -> import { Response } from 'express';
  // ) {
  //   // const file = await this.assetFileService.getFileStream(filename);

  //   response.setHeader('Content-Type', 'application/json');
  //   response.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename="${filename}"`,
  //   );

  //   return new StreamableFile(fileStream);
  // }

  // @Get('stream')
  // stream(@Res() response: Response) {
  //   const file = this.downloadService.imageStream();
  //   file.pipe(response);
  // }

  // @Get('streamable')
  // streamable(@Res({ passthrough: true }) response: Response) {
  //   const file = this.downloadService.fileStream();
  //   // or
  //   // const file = this.downloadService.fileBuffer();
  //   return new StreamableFile(file); // 👈 supports Buffer and Stream
  // }

  // @Get()
  // getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
  //   const file = createReadStream(join(process.cwd(), 'package.json'));
  //   res.set({
  //     'Content-Type': 'application/json',
  //     'Content-Disposition': 'attachment; filename="package.json"',
  //   });
  //   return new StreamableFile(file);
  // }
}
