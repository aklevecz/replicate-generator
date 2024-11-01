/**
 * @typedef {Object} Responses
 * @property {string} CODE_SENT
 * @property {string} AUTHED
 * @property {string} CODE_INVALID
 * @property {string} PHONE_NUMBER_MISMATCH
 * @property {string} UNKNOWN_AUTH_ERROR
 */

/**
 * @typedef {'authenticating' | 'code sent' | 'code verified' | null} FlowState
 */

/**
 * @typedef {{phoneNumber: string}} User
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} authorized
 * @property {User} user
 * @property {FlowState} flow
 */
