import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketIo from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    options = {
      ...options,
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    };
    return super.createIOServer(port, options);
  }
}
