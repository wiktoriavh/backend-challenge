import type { Entity } from "../types.js";
import { processor } from "./processor.js";

export async function invoker(event: Entity): Promise<void> {
  await processor(event);
}
