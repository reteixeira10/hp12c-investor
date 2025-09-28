import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import { rpn } from './utils/rpn';
import { computeFV, computePV, computePMT, computeN, computeIYR } from './utils/tvm';
import { TVM } from './types';
import { toMonthlyRate, toYearlyRate } from './utils/misc';
import { calculateMonthsBetweenDates } from './utils/date';

describe('Calculator App', () => {
  beforeEach(() => {
    render(<App />);
  });

  // ============================================================================
  // TVM Key Tests
  // ============================================================================

  test('it should compute FV correctly', () => {
    const tvm: TVM = { N: 12, IYR: 1, PV: -1000, PMT: -500, FV: 0 };
    const calculatedFV = computeFV(tvm);
    expect(calculatedFV).toBeCloseTo(7468.08, 2);
  });

  test('it should compute PV correctly', () => {
    const tvm: TVM = { N: 12, IYR: 1, PV: 0, PMT: -500, FV: 10000 };
    const calculatedPV = computePV(tvm);
    expect(calculatedPV).toBeCloseTo(-3246.95, 2);
  });

  test('it should compute PMT correctly', () => {
    const tvm: TVM = { N: 12, IYR: 1, PV: 2000, PMT: 0, FV: 0 };
    const calculatedPMT = computePMT(tvm);
    expect(calculatedPMT).toBeCloseTo(-177.70, 2);
  });

  test('it should compute N correctly', () => {
    const tvm: TVM = { N: 0, IYR: 1, PV: -1000, PMT: -100, FV: 5000 };
    const calculatedN = computeN(tvm);
    expect(calculatedN).toBeCloseTo(32, 1); 
  });

  test('it should compute I/YR correctly', () => {
    const tvm: TVM = { N: 12, IYR: 0, PV: -1000, PMT: -100, FV: 5000 };
    const calculatedIYR = computeIYR(tvm);
    expect(calculatedIYR).toBeCloseTo(9.4, 1); 
  });

  // ============================================================================
  // DATE Key Tests
  // ============================================================================

  test('it should correctly calculate the months between two dates', () => {
    const date1 = '10.02.2025';
    const date2 = '20.10.2025';
    const result = calculateMonthsBetweenDates(date1, date2);
    expect(result).toBeCloseTo(8.33, 2);
  });

  // ============================================================================
  // MISC Key Tests
  // ============================================================================

  test('it should correctly convert annual interest rate to monthly', () => {
    const iyr = 12;
    const calculatedMonthlyRate = toMonthlyRate(iyr);
    expect(calculatedMonthlyRate).toBeCloseTo(0.95, 2);
  });

  test('it should correctly convert monthly interest rate to annual', () => {
    const imo = 1;
    const calculatedYearlyRate = toYearlyRate(imo);
    expect(calculatedYearlyRate).toBeCloseTo(12.68, 2);
  });


  // ============================================================================
  // RPN (Reverse Polish Notation) Key Tests
  // ============================================================================

  test('it should correctly perform a sequence of RPN calculations', () => {
    // Simulate the key sequence: 3 enter 4 + 5 enter 6 + *

    // 3 enter 4 +
    const [stack1, result1] = rpn(["3"], "+", "4");
    expect(result1).toBe("7");
    expect(stack1).toEqual(["7"]);

    // 7 enter 5
    const stack2 = [...stack1, "5"];
    expect(stack2).toEqual(["7", "5"]);

    // 7 enter 5 enter 6
    const stack3 = [...stack2, "6"];
    expect(stack3).toEqual(["7", "5", "6"]);

    // 7 enter 5 enter 6 +
    const [stack4, result4] = rpn(stack3, "+", "");
    expect(result4).toBe("11");
    expect(stack4).toEqual(["7", "11"]);

    // 7 enter 11 *
    const [stack5, result5] = rpn(stack4, "×", "");
    expect(result5).toBe("77");
    expect(stack5).toEqual(["77"]);
  });
});
