import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { THROTTLER_CONFIG } from './throttler.config';
@Module({
  imports: [
    CatsModule,
    ThrottlerModule.forRoot([
      { name: 'auth', ...THROTTLER_CONFIG.auth },
      { name: 'public', ...THROTTLER_CONFIG.public },
      { name: 'internal', ...THROTTLER_CONFIG.internal },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
