import { generateBatch } from "../src/fixtures/generateBatch.js";
import { invoker } from "../src/lambdas/invoker.js";
import type { Entity } from "../src/types.js";

async function runBatch(label: string, entities: Entity[]): Promise<void> {
  console.log(`\n--- ${label} (${entities.length} items) ---`);

  let succeeded = 0;
  let failed = 0;

  for (const entity of entities) {
    try {
      await invoker(entity);
      succeeded++;
    } catch (error) {
      failed++;
      console.log(`Failed: ${(error as Error).message}`);
    }
  }

  console.log(`\n${label} summary: ${succeeded} succeeded, ${failed} failed\n`);
}

const BATCH_SIZES = { small: 5, large: 50 } as const;
type BatchName = keyof typeof BATCH_SIZES;

function isBatchName(value: string | undefined): value is BatchName {
  return value === "small" || value === "large";
}

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (arg !== undefined && !isBatchName(arg)) {
    console.error(`Unknown batch "${arg}". Expected "small" or "large".`);
    process.exit(1);
  }

  const batchNames: BatchName[] = isBatchName(arg) ? [arg] : ["small", "large"];

  for (const name of batchNames) {
    await runBatch(`${name} batch`, generateBatch(BATCH_SIZES[name]));
  }
}

main();
