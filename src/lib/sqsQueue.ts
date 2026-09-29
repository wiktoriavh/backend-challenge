import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

type QueueConfig = {
  fifo: boolean;
  maxBatchSize: number;
  maxWaitMs: number;
};

const config = JSON.parse(
  readFileSync(join(__dirname, "../../queue.config.json"), "utf-8"),
) as QueueConfig;

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * A simple in-memory stand-in for an SQS queue. Not wired into the
 * invoker/processor pipeline by default — plug it in yourself.
 */
export function createMockQueue<T>() {
  const messages: { seq: number; item: T }[] = [];
  let nextSeq = 0;

  async function sendMessage(item: T): Promise<void> {
    const seq = nextSeq++;
    const jitterMs = Math.random() * 50;
    await new Promise((resolve) => setTimeout(resolve, jitterMs));
    messages.push({ seq, item });
  }

  async function receiveMessages(): Promise<T[]> {
    const deadline = Date.now() + config.maxWaitMs;

    while (messages.length < config.maxBatchSize && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const batch = messages.splice(0, config.maxBatchSize);

    if (config.fifo) {
      batch.sort((a, b) => a.seq - b.seq);
    } else {
      shuffle(batch);
    }

    return batch.map((message) => message.item);
  }

  return { sendMessage, receiveMessages };
}

/**
 * Repeatedly calls receiveMessages until it returns an empty batch, invoking
 * onBatch for each non-empty batch. Decoupled from any specific queue
 * instance or handler, so a handler (e.g. the processor) can be attached
 * without changing this function.
 */
export async function drainQueue<T>(
  receiveMessages: () => Promise<T[]>,
  onBatch: (batch: T[]) => Promise<void> | void,
): Promise<void> {
  let batch = await receiveMessages();

  while (batch.length > 0) {
    await onBatch(batch);
    batch = await receiveMessages();
  }
}
