/**
 * General API Error
 * @extends Error
 */
export default class APIError extends Error {
  /**
   * Create General API Error
   * @param {string} [entry=''] - entry point that throw error, e.g. fileName.function.suceess/fail
   * @param {string} [type=APIError] - error type @TODO centralize error type into error code table
   * @param {number} [statusCode=500] - HTTP status code
   * @param {string} [message=''] - error message to display
   * @param {object} [details=null] - error details for debugging
   */
  constructor(
    entry = '',
    type = 'APIError',
    statusCode = 500,
    message = '',
    details = null
  ) {
    super(message);
    this.entry = entry;
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}
