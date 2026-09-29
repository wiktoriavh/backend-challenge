export function evaluator(input: unknown): void {
  if (typeof input !== "object" || input === null) {
    throw new Error(`❌ Expected an object, got ${typeof input}`);
  }

  const record = input as Record<string, unknown>;

  if (record.type !== "pet") {
    throw new Error(`❌ Expected type "pet", got ${JSON.stringify(record.type)}`);
  }

  if (typeof record.name !== "string") {
    throw new Error(`❌ Expected name to be a string, got ${typeof record.name}`);
  }

  if (typeof record.age !== "number") {
    throw new Error(`❌ Expected age to be a number, got ${typeof record.age}`);
  }

  if (typeof record.isSenior !== "boolean") {
    throw new Error(`❌ Expected isSenior to be a boolean, got ${typeof record.isSenior}`);
  }

  const expectedIsSenior = record.age >= 10;
  if (record.isSenior !== expectedIsSenior) {
    throw new Error(
      `❌ Expected isSenior to be ${expectedIsSenior} for age ${record.age}, got ${record.isSenior}`,
    );
  }

  console.log(`✅ Success: processed pet ${record.name}`);
}
