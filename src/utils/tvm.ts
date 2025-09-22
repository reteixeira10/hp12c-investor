import { TVMRegisters } from "../types";

// Future Value
export function computeFV({ N, IYR, PV, PMT }: TVMRegisters): number {
  const i = IYR / 100;
  if (i === 0) {
    // FV = - (PV + PMT*N)
    return - (PV + PMT * N);
  } else {
    const A = Math.pow(1 + i, N);
    // FV = - (PV*A + PMT*(A - 1)/i)
    return - (PV * A + PMT * ((A - 1) / i));
  }
}

// Present Value
export function computePV({ N, IYR, FV, PMT }: TVMRegisters): number {
  const i = IYR / 100;
  if (i === 0) {
    // PV = - (PMT*N + FV)
    return - (PMT * N + FV);
  } else {
    const A = Math.pow(1 + i, N);
    // PV = - (PMT*(A - 1)/i + FV) / A
    return - (PMT * ((A - 1) / i) + FV) / A;
  }
}

// Payment
export function computePMT({ N, IYR, PV, FV }: TVMRegisters): number {
  const i = IYR / 100;
  if (N === 0) return 0;
  if (i === 0) {
    // PMT = - (PV + FV) / N
    return - (PV + FV) / N;
  } else {
    const A = Math.pow(1 + i, N);
    // PMT = - (PV*A + FV) * i / (A - 1)
    return - (PV * A + FV) * i / (A - 1);
  }
}

// Number of periods
export function computeN({ IYR, PV, PMT, FV }: TVMRegisters): number {
  const i = IYR / 100;
  let n: number;
  if (i === 0) {
    if (PMT === 0) return 0;
    n = - (PV + FV) / PMT;
  } else {
    const denom = PV + PMT / i;
    if (denom === 0) return 0;
    const X = (-FV + PMT / i) / denom;
    if (X <= 0) return 0;
    n = Math.log(X) / Math.log(1 + i);
  }
  // HP 12C convention: round up to next integer if fractional
  return Math.ceil(n);
}

// Interest rate (I/YR) using Newton-Raphson
export function computeIYR({ N, PV, PMT, FV }: TVMRegisters): number {
  if (N === 0) return 0;
  let i = 0.05; // initial guess (decimal)
  const tol = 1e-10;
  for (let iter = 0; iter < 200; iter++) {
    const A = Math.pow(1 + i, N);
    const f = PV * A + PMT * ((A - 1) / (i === 0 ? 1 : i)) + FV;
    // numeric derivative
    const h = 1e-6;
    const ih = i + h;
    const Ah = Math.pow(1 + ih, N);
    const fh = PV * Ah + PMT * ((Ah - 1) / (ih === 0 ? 1 : ih)) + FV;
    const il = i - h;
    const Al = Math.pow(1 + il, N);
    const fl = PV * Al + PMT * ((Al - 1) / (il === 0 ? 1 : il)) + FV;
    const df = (fh - fl) / (2 * h);
    if (Math.abs(df) < 1e-14) break;
    const newI = i - f / df;
    if (!isFinite(newI)) break;
    if (Math.abs(newI - i) < tol) {
      i = newI;
      break;
    }
    i = newI;
    if (i <= -0.9999) { i = -0.9999; break; }
    if (i > 1e3) { i = 1e3; break; }
  }
  return i * 100;
}