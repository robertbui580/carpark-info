import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class ResponseSuccess {
  public total: number;
  public data: any;

  constructor(data: any, total: number) {
    if (!data) {
      return;
    }
    if (data && typeof data === 'object' && data.data) {
      this.data = data.data;
    } else {
      this.data = data;
    }
    if (total != null) {
      delete data.total;
      this.total = total;
    }
  }
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => new ResponseSuccess(data, data?.total)));
  }
}
