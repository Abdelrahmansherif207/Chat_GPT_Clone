import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

@Injectable()
export class FileParserService {
  async parsePdf(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
  }

  async parseDocx(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  async parseTxt(buffer: Buffer): Promise<string> {
    return buffer.toString('utf-8');
  }
}
