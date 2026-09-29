export type Pet = {
  type: "pet";
  name: string;
  details: {
    age: number;
    breed: string;
  };
};

export type Human = {
  type: "human";
  name: string;
  details: {
    age: number;
    occupation: string;
  };
};

export type Entity = Pet | Human;
