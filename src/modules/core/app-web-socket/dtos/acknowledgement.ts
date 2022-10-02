/**
 * A generic websocket message response that does not mean anything in particular.
 * Use with request handlers to notify clients that their request was handled when there is no other appropriate value to return.
 */
export const ACKNOWLEDGED = "ACKNOWLEDGED";

/**
 * A generic websocket message response that does not mean anything in particular.
 * Use with request handlers to notify clients that their request was handled when there is no other appropriate value to return.
 */
export type Acknowledgement = typeof ACKNOWLEDGED;
