import type { Entity } from "../types.js";

export function evaluator(entity: Entity): void {
  if (entity.type === "human") {
    throw new Error(`❌ Cannot process human entity: ${entity.name}`);
  }

  console.log(`✅ Success: processed pet ${entity.name}`);
}
