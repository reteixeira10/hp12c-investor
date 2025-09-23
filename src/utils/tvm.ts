import { TVM } from "../types";

// Future Value
export function computeFV({ N, IYR, PV, PMT }: TVM): number {
  const i = IYR / 100;
  const fv = PV * Math.pow(1 + i, N) + PMT * (Math.pow(1 + i, N) - 1) / i;
  return -fv;
}

// Present Value
export function computePV({ N, IYR, PMT, FV }: TVM): number {
  const i = IYR / 100;
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
  const n = Math.log((FV * i - PMT) / (PV * i + PMT)) / Math.log(1 + i);
  return n;
}

// Interest Rate
export function computeIYR({ N, PV, PMT, FV }: TVM): number {
  // Bisection method to find IYR
  let minRate = -0.9999, maxRate = 1;
  let i = 0;
  for(let it = 0; it < 100; ++it) {
    i = (minRate + maxRate) / 2;
    const fv = PV * Math.pow(1 + i, N) + PMT * (Math.pow(1 + i, N) - 1) / i + FV;
    if (fv > 0) {
      maxRate = i;
    } else {
      minRate = i;
    }
  }
  return i * 100;
}
