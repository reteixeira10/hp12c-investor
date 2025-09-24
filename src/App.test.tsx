import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { computeFV, computeIYR, computePMT, computeN, computePV } from './utils/tvm';
import { toMonthlyRate, toYearlyRate } from './utils/misc';
import { TVM } from './types';
import { rpn } from './utils/rpn';

// ============================================================================
// TVM (Time Value of Money) Key Tests
// ============================================================================

test('it should correctly calculate the interest rate for the given values', () => {
  const tvmInput: TVM = {
    N: 12.00,
    PV: -500.00,
    PMT: 0.00,
    FV: 2000.00,
    IYR: 0, // This is the value to be calculated
  };

  const calculatedIYR = computeIYR(tvmInput);
  expect(calculatedIYR).toBeCloseTo(12.25, 2);
});

test('it should correctly calculate the payment for amortization', () => {
  const tvmInput: TVM = {
    N: 12.00,
    IYR: 2.00,
    PV: 1000.00,
    FV: 0.00,
    PMT: 0, // This is the value to be calculated
  };

  const calculatedPMT = computePMT(tvmInput);
  expect(calculatedPMT).toBeCloseTo(-94.56, 2);
});

test('it should correctly calculate the payment for an investment with an initial amount and periodic investments', () => {
  const tvmInput: TVM = {
    N: 12.00,
    IYR: 1.00,
    PV: -1000.00,
    FV: 2000.00,
    PMT: 0, // This is the value to be calculated
  };

  const calculatedPMT = computePMT(tvmInput);
  expect(calculatedPMT).toBeCloseTo(-68.85, 2);
});

test('it should correctly calculate the number of periods and round up', () => {
  const tvmInput: TVM = {
    IYR: 1.00,
    PMT: -100.00,
    FV: 2000.00,
    N: 0, // This is the value to be calculated
    PV: 0,
  };

  const calculatedN = computeN(tvmInput);
  expect(calculatedN).toBe(19);
});

test('it should correctly calculate the present value', () => {
  const tvmInput: TVM = {
    N: 12.00,
    IYR: 1.00,
    PMT: 0.00,
    FV: 1000.00,
    PV: 0, // This is the value to be calculated
  };

  const calculatedPV = computePV(tvmInput);
  expect(calculatedPV).toBeCloseTo(-887.45, 2);
});

test('it should correctly calculate the present value when user invest periodic', () => {
  const tvmInput: TVM = {
    N: 12.00,
    IYR: 1.00,
    PMT: -50.00,
    FV: 1000.00,
    PV: 0, // This is the value to be calculated
  };

  const calculatedPV = computePV(tvmInput);
  expect(calculatedPV).toBeCloseTo(-324.70, 2);
});

test('it should correctly calculate the future value', () => {
  const tvmInput: TVM = {
    N: 108.00,
    IYR: 1.50,
    PV: -1000.00,
    PMT: 0.00,
    FV: 0, // This is the value to be calculated
  };

  const calculatedFV = computeFV(tvmInput);
  expect(calculatedFV).toBeCloseTo(4992.67, 2);
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

  // 5 enter
  const stack2 = [...stack1, "5"]; 

  // 6 +
  const [stack3, result2] = rpn(stack2, "+", "6");

  // *
  const [stack4, result3] = rpn(stack3, "×", ""); 

  expect(result3).toBe("77");
});
