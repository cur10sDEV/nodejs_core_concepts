export function calculateFactorial(n: number) {
  let result = 1n;

  for (let i = 2n; i <= n; i++) {
    result = result * i;
  }

  return result;
}
