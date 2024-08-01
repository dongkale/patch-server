import { IsNotEmpty, IsString } from 'class-validator';

export class DownloadFileInfoDto {
  @IsNotEmpty()
  @IsString()
  key1: string;

  @IsNotEmpty()
  @IsString()
  key2: string;
}
