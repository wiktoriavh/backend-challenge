import { evaluator } from "../lib/evaluator.js";
import type { Entity } from "../types.js";

export async function processor(entity: Entity): Promise<void> {
  const message = entity;

  // do not delete this function,
  // this is used for validating the message
  evaluator(message);
}
