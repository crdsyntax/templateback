import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpLog, HttpLogDocument } from '../schemas/http-log.schema';

@Injectable()
export class HttpLoggerService {
  constructor(
    @InjectModel(HttpLog.name) private httpLogModel: Model<HttpLogDocument>,
  ) {}

  async logRequest(request: any): Promise<string> {
    const { method, originalUrl, body, query, params, headers } = request;

    const log = new this.httpLogModel({
      method: method as string,
      url: originalUrl as string,
      body: this.sanitizeBody(body),
      query: query || {},
      params: params || {},
      ip: this.getClientIp(request) || '',
      userAgent: headers?.['user-agent'] || '',
    });

    const savedLog = await log.save();
    return (savedLog as any)._id.toString();
  }

  async updateLog(logId: string, update: Partial<HttpLog>) {
    return this.httpLogModel.findByIdAndUpdate(logId, update, { new: true });
  }

  private sanitizeBody(body: any) {
    if (!body) return body;
    const sanitized = { ...body };

    ['password', 'token', 'accessToken', 'refreshToken'].forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket?.remoteAddress
    );
  }
}
