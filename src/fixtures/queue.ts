import { createMockQueue, drainQueue } from "../lib/sqsQueue.js";
import type { Entity } from "../types.js";

const queue = createMockQueue<Entity>();

export const sendMessage = queue.sendMessage;
export const receiveMessages = queue.receiveMessages;

export function drain(
  onBatch: (batch: Entity[]) => Promise<void> | void,
): Promise<void> {
  return drainQueue(receiveMessages, onBatch);
}
