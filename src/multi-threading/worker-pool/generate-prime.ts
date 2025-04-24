export function generatePrimes(m: number, n: number): number[] {
  if (n <= 0) return [];
  if (m < 2) m = 2;

  const primes = [];
  let currentNum = m;

  while (primes.length < n) {
    if (isPrime(currentNum)) {
      primes.push(currentNum);
    }
    currentNum++;
  }

  return primes;

  function isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    const sqrt = Math.sqrt(num);
    for (let i = 5; i <= sqrt; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) {
        return false;
      }
    }

    return true;
  }
}
