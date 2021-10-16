import { Lens, composeLenses, Reducer, composeReducerWithLens } from ".";

interface Speed {
  value: number;
  unit: "km/h";
}

interface Car {
  speed: Speed;
  seats: number;
}

const focusOnSpeed: Lens<Car, Speed> = {
  get: ({ speed }) => speed,
  set: (car, speed) => ({ ...car, speed }),
};

const car: Car = {
  speed: {
    value: 50,
    unit: "km/h",
  },
  seats: 5,
};

describe("A lens allows to focus on a specific part of a larger object", () => {
  test("Read", () => {
    expect(focusOnSpeed.get(car)).toEqual({
      value: 50,
      unit: "km/h",
    });
  });

  test("Write", () => {
    const actual = focusOnSpeed.set(car, {
      value: 60,
      unit: "km/h",
    });
    const expected: Car = {
      speed: {
        value: 60,
        unit: "km/h",
      },
      seats: 5,
    };
    expect(actual).toEqual(expected);
  });
});

const focusOnValue: Lens<Speed, number> = {
  get: ({ value }) => value,
  set: (speed, value) => ({ ...speed, value }),
};

const focusOnSpeedValue: Lens<Car, number> = composeLenses(focusOnSpeed, focusOnValue);

describe("Lenses compose easily", () => {
  test("Read", () => {
    expect(focusOnSpeedValue.get(car)).toEqual(50);
  });

  test("Write", () => {
    const actual = focusOnSpeedValue.set(car, 60);
    const expected: Car = {
      speed: {
        value: 60,
        unit: "km/h",
      },
      seats: 5,
    };
    expect(actual).toEqual(expected);
  });
});

const raiseSpeed: Reducer<Speed> = ({ value }) => ({
  value: value + 10,
  unit: "km/h",
});

const accelerate: Reducer<Car> = composeReducerWithLens(focusOnSpeed, raiseSpeed);

describe("Composition with reducers", function () {
  test("Composition with reducers", () => {
    const actual = accelerate(car);
    const expected: Car = {
      speed: {
        value: 60,
        unit: "km/h",
      },
      seats: 5,
    };
    expect(actual).toEqual(expected);
  });
});
