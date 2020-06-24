// https://www.staging-typescript.org/docs/handbook/advanced-types.html#mapped-types
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(o: T): Proxify<T> {
  const proxyfied = {} as Proxify<T>;

  for (const prop in o) {
    let currentValue = o[prop];

    proxyfied[prop] = {
      get: function () {
        return currentValue;
      },
      set: function (newValue) {
        currentValue = newValue;
      },
    };
  }

  return proxyfied;
}

// https://www.staging-typescript.org/docs/handbook/advanced-types.html#inference-from-mapped-types
function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result;
}

const props = {
  name: "dptole",
  age: 1,
  true: false,
  undefined: null,
  null: undefined,
  array: {},
  object: [],
};

let proxyProps = proxify(props);

console.log("proxyProps.name.get()");
console.log(proxyProps.name.get());
console.log("");

console.log("proxyProps.name.set('gitlab.com/dptole')");
proxyProps.name.set("gitlab.com/dptole");
console.log("proxyProps.name.get()");
console.log(proxyProps.name.get());
console.log("");

console.log("proxyProps.age.get()");
console.log(proxyProps.age.get());
console.log("");

console.log("proxyProps.age.set(2)");
proxyProps.age.set(2);
console.log("proxyProps.age.get()");
console.log(proxyProps.age.get());
console.log("");

console.log("proxyProps.true.get()");
console.log(proxyProps.true.get());
console.log("");

console.log("proxyProps.true.set(true)");
proxyProps.true.set(true);
console.log("proxyProps.true.get()");
console.log(proxyProps.true.get());
console.log("");

console.log("proxyProps.undefined.get()");
console.log(proxyProps.undefined.get());
console.log("");

console.log("proxyProps.undefined.set(undefined as any)");
proxyProps.undefined.set(undefined as any);
console.log("proxyProps.undefined.get()");
console.log(proxyProps.undefined.get());
console.log("");

console.log("proxyProps.null.get()");
console.log(proxyProps.null.get());
console.log("");

console.log("proxyProps.null.set(null as any)");
proxyProps.null.set(null as any);
console.log("proxyProps.null.get()");
console.log(proxyProps.null.get());
console.log("");

console.log("proxyProps.array.get()");
console.log(proxyProps.array.get());
console.log("");

console.log("proxyProps.array.set([1, 2, 3] as any)");
proxyProps.array.set([1, 2, 3] as any);
console.log("proxyProps.array.get()");
console.log(proxyProps.array.get());
console.log("");

console.log("proxyProps.object.get()");
console.log(proxyProps.object.get());
console.log("");

console.log("proxyProps.object.set(proxyProps as any)");
proxyProps.object.set(proxyProps as any);
console.log("proxyProps.object.get()");
console.log(proxyProps.object.get());
console.log("");

console.log("unproxify(proxyProps)");
console.log(unproxify(proxyProps));
console.log("");
