import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { FileParserService } from './file-parser.service';
import { EmbeddingService } from './embedding.service';
import { GeminiService } from './gemini.service';

@Controller('chat')
export class ChatController {
  constructor(
    private configService: ConfigService,
    private appService: AppService,
    private fileParser: FileParserService,
    private embeddingService: EmbeddingService,
    private geminiService: GeminiService,
  ) {}

  @Post('text')
  async chatText(@Body('message') message: string) {
    const response = await this.geminiService.chat([
      { role: 'user', content: message },
    ]);
    return { response };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async chatImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('message') message: string,
  ) {
    if (!file) throw new BadRequestException('No image uploaded');
    // Use Gemini Vision for image+text analysis
    const response = await this.geminiService.chatVision(
      message ? [{ role: 'user', content: message }] : [],
      file.buffer,
      file.mimetype,
    );
    return { response };
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async chatFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('question') question: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    let text = '';
    if (file.mimetype === 'application/pdf') {
      text = await this.fileParser.parsePdf(file.buffer);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await this.fileParser.parseDocx(file.buffer);
    } else if (file.mimetype === 'text/plain') {
      text = await this.fileParser.parseTxt(file.buffer);
    } else {
      throw new BadRequestException('Unsupported file type');
    }

    const response = await this.geminiService.chat([
      {
        role: 'user',
        content:
          `[System Prompt]: You are a helpful assistant. Use the provided file content to answer.\n\n` +
          `File content:\n${text}\n\nQuestion: ${question}`,
      },
    ]);
    return { response };
  }

  @Post('embed')
  async embedText(@Body('text') text: string) {
    await this.embeddingService.addChunk(text);
    return { status: 'embedded' };
  }

  @Post('rag')
  async rag(@Body('query') query: string) {
    const relevant = await this.embeddingService.retrieveRelevant(query);
    const context = relevant.map((c) => c.text).join('\n---\n');

    const response = await this.geminiService.chat([
      {
        role: 'user',
        content:
          `[System Prompt]: You are a helpful assistant. Use the provided context to answer.\n\n` +
          `Context:\n${context}\n\nQuestion: ${query}`,
      },
    ]);
    return { response, context: relevant };
  }

  @Get('models')
  async listGeminiModels() {
    return await this.geminiService.listModels();
  }
}
