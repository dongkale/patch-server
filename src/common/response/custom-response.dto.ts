export class CustomResponseDto<T> {
  public static readonly SUCCESS_CODE = 0;
  public static readonly SUCCESS_STRING = 'Success';

  resultCode: number;

  resultMessage: string;

  resultData: T[];
}

export function makeSuccessCustomResponseDto(resultData: any) {
  return {
    resultCode: CustomResponseDto.SUCCESS_CODE,
    resultMessage: CustomResponseDto.SUCCESS_STRING,
    resultData: resultData,
  };
}

export function makeFailCustomResponseDto(
  resultCode: number = CustomResponseDto.SUCCESS_CODE,
  resultMessage: string = CustomResponseDto.SUCCESS_STRING,
  resultData: any,
) {
  return {
    resultCode: resultCode,
    resultMessage: resultMessage,
    resultData: resultData,
  };
}
