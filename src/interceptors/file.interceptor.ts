import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    BadRequestException,
    CallHandler,
  } from '@nestjs/common';
  
  @Injectable()
  export class FileNameRegexInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest();
      const regex = /^speakers\[\d+\]\[image\]$/;
  
      const invalidFields = Object.keys(request.files || {}).filter(
        (fieldName) => !regex.test(fieldName),
      );
  
      if (invalidFields.length > 0) {
        throw new BadRequestException(
          `Invalid file field names: ${invalidFields.join(', ')}`,
        );
      }
  
      return next.handle();
    }
  }
  