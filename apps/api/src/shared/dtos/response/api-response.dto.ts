import { Expose } from 'class-transformer';

export class PagingMetadata {
  @Expose()
  page!: number;

  @Expose()
  limit!: number;

  @Expose()
  total!: number;
}

export class ApiResponse<T> {
  @Expose()
  success!: boolean;

  @Expose()
  message!: string;

  @Expose()
  data!: T;

  @Expose()
  statusCode!: number;

  @Expose()
  paging?: PagingMetadata;

  static success<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
  ): ApiResponse<T> {
    const response = new ApiResponse<T>();
    response.success = true;
    response.message = message;
    response.data = data;
    response.statusCode = statusCode;
    return response;
  }

  static successWithPaging<T>(
    data: T,
    paging: PagingMetadata,
    message = 'Success',
    statusCode = 200,
  ): ApiResponse<T> {
    const response = ApiResponse.success(data, message, statusCode);
    response.paging = paging;
    return response;
  }

  static error(
    message: string,
    statusCode = 500,
    data: unknown = null,
  ): ApiResponse<unknown> {
    const response = new ApiResponse<unknown>();
    response.success = false;
    response.message = message;
    response.data = data;
    response.statusCode = statusCode;
    return response;
  }
}
