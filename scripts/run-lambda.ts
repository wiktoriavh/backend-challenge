import { generateBatch } from "../src/fixtures/generateBatch.js";
import { invoker, InvokerValidationError } from "../src/lambdas/invoker.js";
import { processor } from "../src/lambdas/processor.js";
import type { Entity } from "../src/types.js";

// The invoker rejecting an invalid/non-pet event is the correct, intended
// behavior — that counts as a success, not a failure. Only an error past
// that point (processor/evaluator) means the pipeline actually broke.
function recordOutcome(error: unknown, counts: { succeeded: number; failed: number }): void {
  if (error instanceof InvokerValidationError) {
    counts.succeeded++;
    console.log(`✅ Correctly rejected: ${error.message}`);
  } else {
    counts.failed++;
    console.log(`❌ Unexpected failure: ${(error as Error).message}`);
  }
}

async function runBatchWithQueue(label: string, entities: Entity[]): Promise<void> {
  const counts = { succeeded: 0, failed: 0 };

  for (const entity of entities) {
    try {
      await invoker(entity);
    } catch (error) {
      recordOutcome(error, counts);
    }
  }

  const result = await processor();
  counts.succeeded += result.succeeded;
  counts.failed += result.failed;

  console.log(
    `\n${label} summary: ${counts.succeeded} succeeded, ${counts.failed} failed\n`,
  );
}

async function runBatchDirect(label: string, entities: Entity[]): Promise<void> {
  const counts = { succeeded: 0, failed: 0 };

  for (const entity of entities) {
    try {
      await invoker(entity, { useQueue: false });
      counts.succeeded++;
    } catch (error) {
      recordOutcome(error, counts);
    }
  }

  console.log(
    `\n${label} summary: ${counts.succeeded} succeeded, ${counts.failed} failed\n`,
  );
}

async function runBatch(
  label: string,
  entities: Entity[],
  useQueue: boolean,
): Promise<void> {
  console.log(`\n--- ${label} (${entities.length} items, ${useQueue ? "via queue" : "direct"}) ---`);

  if (useQueue) {
    await runBatchWithQueue(label, entities);
  } else {
    await runBatchDirect(label, entities);
  }
}

const BATCH_SIZES = { small: 5, large: 50 } as const;
type BatchName = keyof typeof BATCH_SIZES;

function isBatchName(value: string | undefined): value is BatchName {
  return value === "small" || value === "large";
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const useQueue = !args.includes("--no-queue");
  const arg = args.find((value) => !value.startsWith("--"));

  if (arg !== undefined && !isBatchName(arg)) {
    console.error(`Unknown batch "${arg}". Expected "small" or "large".`);
    process.exit(1);
  }

  const batchNames: BatchName[] = isBatchName(arg) ? [arg] : ["small", "large"];

  for (const name of batchNames) {
    await runBatch(`${name} batch`, generateBatch(BATCH_SIZES[name]), useQueue);
  }
}

main();
