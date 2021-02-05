export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
