// Run: `npx ts-node src/init-db.ts`

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const databaseService = app.get(DatabaseService);

  console.log('Initializing database tables...');
  await databaseService.initializeTables();
  console.log('Database initialization completed!');

  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});
