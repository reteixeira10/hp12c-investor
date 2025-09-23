import { TVM } from "../types";

// Future Value
export function computeFV({ N, IYR, PV, PMT }: TVM): number {
  const i = IYR / 100;
  if (i === 0) {
    return -(PV + PMT * N);
  }
  const fv = PV * Math.pow(1 + i, N) + PMT * (Math.pow(1 + i, N) - 1) / i;
  return -fv;
}

// Present Value
export function computePV({ N, IYR, PMT, FV }: TVM): number {
  const i = IYR / 100;
  if (i === 0) {
    return -(FV + PMT * N);
  }
  const pv = (FV + PMT * (Math.pow(1 + i, N) - 1) / i) / Math.pow(1 + i, N);
  return -pv;
}

// Payment
export function computePMT({ N, IYR, PV, FV }: TVM): number {
  const i = IYR / 100;
  // Handle case where interest is 0
  if (i === 0) {
    return (-PV - FV) / N;
  }
  // Based on standard formula: PMT = (-PV * (1+i)^N - FV) * i / ((1+i)^N - 1)
  const pmt = (-PV * Math.pow(1 + i, N) - FV) * i / (Math.pow(1 + i, N) - 1);
  return pmt;
}

// Number of Periods
export function computeN({ IYR, PV, PMT, FV }: TVM): number {
  const i = IYR / 100;
  if (i === 0) {
    // Handle no-interest case. Based on PV + FV + N * PMT = 0
    if (PMT !== 0) {
      return -(PV + FV) / PMT;
    } else {
      return Infinity; // Or some indicator of an issue
    }
  }
  const n = Math.log((PMT - FV * i) / (PMT + PV * i)) / Math.log(1 + i);
  return Math.ceil(n);
}

// Interest Rate
export function computeIYR({ N, PV, PMT, FV }: TVM): number {
  // Bisection method to find IYR
  const f = (i: number): number => {
    if (Math.abs(i) < 1e-9) {
      return PV + PMT * N + FV;
    }
    return PV * Math.pow(1 + i, N) + PMT * (Math.pow(1 + i, N) - 1) / i + FV;
  };

  let minRate = -0.9999,
    maxRate = 1;
  let i = 0;

  const fAtMin = f(minRate);
  const fAtMax = f(maxRate);

  if (fAtMin * fAtMax > 0) {
    // Extend the search range if no root is found in the initial range
    minRate = -0.9999; // Reset min rate
    maxRate = 100; // Increase max rate
    for (let j = 0; j < 10; j++) {
      if (f(minRate) * f(maxRate) < 0) break;
      maxRate *= 2; // Heuristically extend search range
    }
  }

  const isIncreasing = f(minRate) < f(maxRate);

  for (let it = 0; it < 100; ++it) {
    i = (minRate + maxRate) / 2;
    const fv = f(i);

    if (Math.abs(fv) < 1e-10) {
      break;
    }

    if (isIncreasing) {
      if (fv > 0) {
        maxRate = i;
      } else {
        minRate = i;
      }
    } else {
      // decreasing function
      if (fv > 0) {
        minRate = i;
      } else {
        maxRate = i;
      }
    }
  }
  return i * 100;
}
