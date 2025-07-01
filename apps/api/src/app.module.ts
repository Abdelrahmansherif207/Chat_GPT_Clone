import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './chat.controller';
import { FileParserService } from './file-parser.service';
import { EmbeddingService } from './embedding.service';
import { GeminiService } from './gemini.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, ChatController],
  providers: [AppService, FileParserService, EmbeddingService, GeminiService],
})
export class AppModule {}
