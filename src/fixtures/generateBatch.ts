import type { Entity, Pet, Human } from "../types.js";

const PET_NAMES = [
  "Rex", "Whiskers", "Buddy", "Luna", "Milo", "Bella", "Max", "Charlie",
  "Daisy", "Rocky", "Coco", "Simba", "Nala", "Oreo", "Peanut", "Ziggy",
  "Gizmo", "Shadow", "Pepper", "Biscuit",
];
const PET_BREEDS = [
  "Labrador", "Siamese", "Beagle", "Tabby", "Poodle", "Bulldog", "Persian",
  "Dachshund", "Maine Coon", "Golden Retriever", "Sphynx", "Corgi",
  "Ragdoll", "German Shepherd", "Tortoiseshell",
];
const HUMAN_NAMES = [
  "Alice", "Bob", "Carla", "Dev", "Elena", "Farid", "Grace", "Hiro",
  "Ines", "Jamal", "Kira", "Liam", "Mona", "Noah", "Olga", "Priya",
  "Quentin", "Rosa", "Sami", "Tara",
];
const HUMAN_OCCUPATIONS = [
  "Engineer", "Teacher", "Chef", "Pilot", "Nurse", "Architect", "Plumber",
  "Accountant", "Electrician", "Journalist", "Veterinarian", "Barista",
  "Firefighter", "Librarian", "Mechanic",
];

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomPet(): Pet {
  return {
    type: "pet",
    name: randomFrom(PET_NAMES),
    details: {
      age: Math.floor(Math.random() * 15) + 1,
      breed: randomFrom(PET_BREEDS),
    },
  };
}

function randomHuman(): Human {
  return {
    type: "human",
    name: randomFrom(HUMAN_NAMES),
    details: {
      age: Math.floor(Math.random() * 60) + 18,
      occupation: randomFrom(HUMAN_OCCUPATIONS),
    },
  };
}

export function generateBatch(size: number): Entity[] {
  return Array.from({ length: size }, () =>
    Math.random() < 0.5 ? randomPet() : randomHuman(),
  );
}
