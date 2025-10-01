export function toMonthlyRate(iyr: number): number {
  return (Math.pow(1 + iyr / 100, 1 / 12) - 1) * 100;
}

export function toYearlyRate(imo: number): number {
  return (Math.pow(1 + imo / 100, 12) - 1) * 100;
}

export function toFifteenPercentIR(value: number): number {
  return value / (1 - 0.15);
}

export function toTwentyTwoPointFivePercentIR(value: number): number {
  return value / (1 - 0.225);
}
