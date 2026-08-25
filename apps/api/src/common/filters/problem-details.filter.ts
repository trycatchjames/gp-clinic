import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainException } from '../problem-details';

const PROBLEM_BASE = 'https://gp-prototype.dev/problems';

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof DomainException) {
      const body = exception.getResponse() as {
        problemType: string;
        title: string;
        detail?: string;
        fieldErrors?: { field: string; message: string }[];
      };
      return response.status(exception.getStatus()).json({
        type: `${PROBLEM_BASE}/${body.problemType}`,
        title: body.title,
        status: exception.getStatus(),
        detail: body.detail,
        instance: request.originalUrl,
        errors: body.fieldErrors,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const detail =
        typeof payload === 'string'
          ? payload
          : ((payload as { message?: string | string[] }).message ?? undefined);

      // class-validator produces an array of messages; turn them into field errors.
      const errors = Array.isArray(detail)
        ? detail.map((message) => ({ field: message.split(' ')[0], message }))
        : undefined;

      return response.status(status).json({
        type: `${PROBLEM_BASE}/${slug(exception.name)}`,
        title: exception.name.replace(/Exception$/, ''),
        status,
        detail: Array.isArray(detail) ? detail.join('; ') : detail,
        instance: request.originalUrl,
        errors,
      });
    }

    this.logger.error(exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      type: `${PROBLEM_BASE}/internal-error`,
      title: 'Internal server error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      instance: request.originalUrl,
    });
  }
}

function slug(name: string): string {
  return name
    .replace(/Exception$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}
