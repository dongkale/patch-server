import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Patch } from '@/patch/patch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class PatchService {
  private readonly logger = new Logger(PatchService.name);

  constructor(
    @InjectRepository(Patch)
    private readonly patchRepository: Repository<Patch>,
    private configService: ConfigService,
  ) {}

  async getPatchs(): Promise<Patch[]> {
    try {
      const patchs = await this.patchRepository.find();

      // url 리스트 배열로 보낸다
      // const patchList = [];

      // for (const patch of patchs) {
      //   patchList.push({
      //     filePath: patch.filePath,
      //     checksum: patch.checksum,
      //     forceUpdate: patch.forceUpdate,
      //   });
      // }

      // patchList.push({
      //   filePath: 'patch/text01.txt',
      //   checksum: 'cb08ca4a7bb5f9683c19133a84872ca7',
      //   updateStatus: true,
      // });
      // patchList.push({
      //   filePath: 'patch/text02.txt',
      //   checksum: 'f38c26a09c89158123f77b474221cc8a',
      //   updateStatus: true,
      // });
      // patchList.push({
      //   filePath: 'patch/text03.txt',
      //   checksum: 'cdd50a3cc4c11350b4f7a97b9c83b569',
      //   updateStatus: true,
      // });

      // const response: ResponsePartDto[] = [];

      // if (Array.isArray(parts)) {
      //   for (const part of parts) {
      //     const parseData = JSON.parse(part.dataJson);
      //     this.logger.debug(parseData);
      //     this.logger.debug(
      //       `List: id: ${part.id}, name: ${part.name}, description: ${part.description}, data_json: ${JSON.stringify(part.dataJson)}, created_at: ${part.createdAt}, updated_at: ${part.updatedAt}`,
      //     );
      //   }
      // }
      // const s = ResponsePartDto.convertFromPart(null);
      // console.log(s);

      // return ResponsePartDto.convertFromPart(parts);

      // return patchList;
      return patchs;
    } catch (error) {
      this.logger.debug(error);
      throw error;
    }
  }

  async getFileStream(fileName: string) {
    // const assetFile = await this.findOne(fileName);
    // if (!assetFile) {
    //   throw new NotFoundException('파일을 찾을 수 없습니다.');
    // }
    // const assetFilePath = join(
    //   process.cwd(),
    //   `/${assetFile.destinationFolder}/`,
    //   `${assetFile.transformFileName}`,
    // );

    // const destFileName = 'image_01.bin';

    // DB 가 필요 없을듯

    const patchFilePath = this.configService.get('PATCH_FILE_PATH');
    const patchFileSubPath = this.configService.get(
      'PATCH_FILE_DOWNLOAD_SUB_PATH',
    );

    const filePath = join(
      process.cwd(),
      patchFilePath,
      `/${patchFileSubPath}/${fileName}`,
    );
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    // const fileStream = fs.createReadStream(filePath);
    // const fileSize = fs.statSync(filePath).size;

    return {
      fileStream: fs.createReadStream(filePath),
      fileSize: fs.statSync(filePath).size,
      filePath: filePath,
      fileName: fileName,
    };
  }
}
