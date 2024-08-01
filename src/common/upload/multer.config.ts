// import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
// import { MulterOptionsFactory } from '@nestjs/platform-express';
// import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// @Injectable()
// export class MulterConfigService implements MulterOptionsFactory {
//   dirPath: string;
//   constructor(private readonly path: string) {
//     this.dirPath = path; //  path;

//     fs.mkdirSync(this.dirPath, { recursive: true });
//   }

//   createMulterOptions(): MulterOptions {
//     const dirPath = this.dirPath;
//     const option = {
//       storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//           cb(null, dirPath);
//         },

//         filename: (req, file, cb) => {
//           const ext = path.extname(file.originalname);
//           const name = path.basename(file.originalname, ext);
//           cb(null, `${name}_${Date.now()}${ext}`);
//         },
//       }),
//       limits: {
//         fileSize: 1024 * 1024 * 10, // 10MB
//       },
//     };
//     return option;
//   }
// }

export const multerConfigService = (dirPath: string, errorPath: string) => {
  const logger = new Logger('multerConfigService');

  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(errorPath)) {
      fs.mkdirSync(errorPath, { recursive: true });
    }
  } catch (error) {
    logger.error('Error while creating directory', error);
  }

  return {
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        const { folderName, lastedFolderName } = req.body; // postman 테스트시 이 부분이 작동할려면  에서 folderName 를 가장 먼저 위치해둔다 https://stackoverflow.com/questions/75015769/nestjs-multer-not-as-expected

        if (folderName === undefined) {
          logger.error('Folder Name is required');
          return cb(new Error('Folder Name is required'), null);
        }

        logger.log(
          `fileName: ${decodeURIComponent(file.originalname)} -> LastedFolderName: ${lastedFolderName}, FolderName: ${folderName}`,
        );

        if (lastedFolderName !== undefined) {
          const renameFolder = `${dirPath}/${lastedFolderName}`;
          const renamedFolder = `${dirPath}/__LASTED_${lastedFolderName}`;

          try {
            if (fs.existsSync(renameFolder)) {
              // return cb(new Error('LastedFolder Name is not found'), null);
              fs.renameSync(renameFolder, renamedFolder);
            }

            // fs.rename(renameFolder + '__', renamedFolder, function (err) {
            //   if (err) {
            //     logger.error(`${err}`);
            //     // throw err; // new Error(err.message);
            //     return cb(new Error(err.message), null);
            //   }
            // });
          } catch (error) {
            logger.error('Error while rename directory', error);
            return cb(new Error(error.message), null);
          }
        }

        const destPath = `${dirPath}/${folderName}`;

        try {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
        } catch (error) {
          logger.error('Error while creating directory', error);
          return cb(new Error(error.message), null);
        }

        return cb(null, destPath);
      },
      filename: (req, file, cb) => {
        // const __v__ = Buffer.from(file.originalname, 'euc=-kr').toString('utf8');

        // const fileName = file.originalname.split('.');
        // const fileExt = fileName.pop();
        const decodeFileName = decodeURIComponent(file.originalname);
        const originalname = file.originalname;
        file.originalname = decodeFileName;

        const fileExt = path.extname(file.originalname);
        const fileName = path.basename(file.originalname, fileExt);

        // const transformFileName = `${fileName}_${Date.now()}${fileExt}`;
        const transformFileName = `${fileName}${fileExt}`;

        logger.log(`FileName: ${originalname} -> ${transformFileName}`);

        return cb(null, transformFileName);
      },
    }),
  };
};
