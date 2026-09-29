import { generateBatch } from "../src/fixtures/generateBatch.js";
import { invoker } from "../src/lambdas/invoker.js";
import { processor } from "../src/lambdas/processor.js";
import type { Entity } from "../src/types.js";

async function runBatchWithQueue(label: string, entities: Entity[]): Promise<void> {
  let enqueueFailed = 0;

  for (const entity of entities) {
    try {
      await invoker(entity);
    } catch (error) {
      enqueueFailed++;
      console.log(`Failed: ${(error as Error).message}`);
    }
  }

  const { succeeded, failed } = await processor();

  console.log(
    `\n${label} summary: ${succeeded} succeeded, ${failed + enqueueFailed} failed\n`,
  );
}

async function runBatchDirect(label: string, entities: Entity[]): Promise<void> {
  let succeeded = 0;
  let failed = 0;

  for (const entity of entities) {
    try {
      await invoker(entity, { useQueue: false });
      succeeded++;
    } catch (error) {
      failed++;
      console.log(`Failed: ${(error as Error).message}`);
    }
  }

  console.log(`\n${label} summary: ${succeeded} succeeded, ${failed} failed\n`);
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
