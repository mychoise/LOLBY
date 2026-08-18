import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    console.error('WS handler error:', exception);
    client.emit('error', { message: 'Something went wrong' });
    // does NOT call super.catch() blindly — that can still rethrow in some versions
  }
}
