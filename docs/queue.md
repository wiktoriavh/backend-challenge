# Queue

`src/fixtures/queue.ts` exports a ready-to-use `Entity` queue — no setup needed.

## Import

```ts
import { sendMessage, receiveMessages, drain } from "../src/fixtures/queue.js";
```

## API

### `sendMessage(item: Entity): Promise<void>`

Enqueues a single item. Resolves after a small random delay (0–50ms).

```ts
await sendMessage(item);
```

Call it once per item.

### `receiveMessages(): Promise<Entity[]>`

Waits for messages to arrive, then returns a batch and removes those items from the queue.

```ts
const batch = await receiveMessages();
```

It waits up to `maxWaitMs`, collecting up to `maxBatchSize` items, then returns whatever it has — even if that's fewer than `maxBatchSize`, or empty. Call it again to drain more of the queue.

### `drain(onBatch: (batch: Entity[]) => Promise<void> | void): Promise<void>`

Keeps calling `receiveMessages()` — handing each non-empty batch to `onBatch` — until an empty batch comes back (the queue is empty).

```ts
await drain(async (batch) => {
  // handle each batch here
});
```

## Configuration

Behavior is controlled by [`queue.config.json`](../queue.config.json) in the repo root:

| field          | meaning                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| `fifo`         | `false` returns each batch in shuffled order. `true` returns items in the exact order `sendMessage` was called. |
| `maxBatchSize` | Max number of items `receiveMessages()` returns in one call.                                                    |
| `maxWaitMs`    | How long `receiveMessages()` waits for items to arrive before returning whatever it has.                        |
