import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/** RFC 9457 problem details. Every error the API returns has this shape. */
export class ProblemDetails {
  @ApiProperty({ example: 'https://gp-prototype.dev/problems/validation-failed' })
  type: string;

  @ApiProperty({ example: 'Validation failed' })
  title: string;

  @ApiProperty({ example: 422 })
  status: number;

  @ApiProperty({ example: 'One or more fields were rejected.', required: false })
  detail?: string;

  @ApiProperty({ example: '/api/practices', required: false })
  instance?: string;

  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        field: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  errors?: { field: string; message: string }[];
}

export class DomainException extends HttpException {
  constructor(
    status: HttpStatus,
    public readonly problemType: string,
    title: string,
    detail?: string,
    public readonly fieldErrors?: { field: string; message: string }[],
  ) {
    super({ problemType, title, detail, fieldErrors }, status);
  }
}

/** A rule the practice cannot proceed past — e.g. BBPIP without MyMedicare. */
export class BusinessRuleException extends DomainException {
  constructor(problemType: string, title: string, detail: string) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, problemType, title, detail);
  }
}
