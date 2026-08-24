import { AppResponse, RESPONSE_STATUS } from "./response";
import { logger } from "./logger";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {}
export class ConflictError extends AppError {}
export class NotFoundError extends AppError {}
export class UnauthorizedError extends AppError {}
export class ForbiddenError extends AppError {}
export class InternalServerError extends AppError {}
export class BadRequestError extends AppError {}
export class ServiceUnavailableError extends AppError {}

const PG_UNIQUE_VIOLATION = "23505";

type PostgresError = Error & {
  code?: string;
  constraint?: string;
  detail?: string;
};

function findPgError(error: unknown): PostgresError | undefined {
  if (!(error instanceof Error)) return undefined;
  if ("code" in error) return error as PostgresError;
  if (error.cause) return findPgError(error.cause);
  return undefined;
}

const UNIQUE_CONSTRAINT_MESSAGES: Record<string, string> = {
  gyms_slug_unique: "This slug is already taken.",
  gyms_email_unique: "This email is already in use.",
  gyms_phone_unique: "This phone number is already in use.",
  gyms_owner_user_id_key: "You already have a gym registered.",
};

export const handleError = (label: string, error: unknown) => {
  logger.error({ err: error }, `${label} error`);

  const pgError = findPgError(error);
  switch (pgError?.code) {
    case PG_UNIQUE_VIOLATION:
      return {
        status: RESPONSE_STATUS.conflict,
        body: AppResponse.conflict(
          (pgError.constraint && UNIQUE_CONSTRAINT_MESSAGES[pgError.constraint]) ||
            "A record with the same value already exists."
        ),
      };
  }

  switch (true) {
    case error instanceof ValidationError:
      return {
        status: RESPONSE_STATUS.unprocessable,
        body: AppResponse.unprocessable(error.details, error.message),
      };

    case error instanceof BadRequestError:
      return {
        status: RESPONSE_STATUS.badRequest,
        body: AppResponse.badRequest(error.details, error.message),
      };

    case error instanceof ConflictError:
      return { status: RESPONSE_STATUS.conflict, body: AppResponse.conflict(error.message) };

    case error instanceof NotFoundError:
      return { status: RESPONSE_STATUS.notFound, body: AppResponse.notFound(error.message) };

    case error instanceof UnauthorizedError:
      return { status: RESPONSE_STATUS.unauthorized, body: AppResponse.unauthorized(error.message) };

    case error instanceof ForbiddenError:
      return { status: RESPONSE_STATUS.forbidden, body: AppResponse.forbidden(error.message) };

    case error instanceof ServiceUnavailableError:
      return { status: RESPONSE_STATUS.tooMany, body: AppResponse.tooMany(error.message) };

    case error instanceof InternalServerError:
      return { status: RESPONSE_STATUS.internal, body: AppResponse.internal(error.message) };

    default:
      return {
        status: RESPONSE_STATUS.internal,
        body: AppResponse.internal("Internal server error"),
      };
  }
};