import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: {
    [key: string]: any;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // Handle pagination
        if (data && data.items && data.meta) {
          return {
            data: data.items,
            meta: data.meta,
          };
        }

        // Handle regular responses
        return {
          data,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
