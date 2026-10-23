import assert from "node:assert/strict";
import { test } from "node:test";
import { computeLoan, formatUsd } from "./loanMath.ts";

test("1 BTC at $100,000", () => {
  const l = computeLoan(100_000, 1);
  assert.equal(l.collateralValue, 100_000);
  assert.equal(l.receive, 50_000);
  assert.equal(l.put, 85_000);
  assert.equal(l.call, 115_000);
});

test("100 wBNB at $600", () => {
  const l = computeLoan(600, 100);
  assert.equal(l.receive, 30_000);
  assert.equal(l.put, 510);
  assert.equal(l.call, 690);
});

test("live tick: BTC at $102,000", () => {
  const l = computeLoan(102_000, 1);
  assert.equal(l.receive, 51_000);
  assert.equal(Math.round(l.put), 86_700);
  assert.equal(Math.round(l.call), 117_300);
});

test("formatUsd", () => {
  assert.equal(formatUsd(50_000), "$50,000");
  assert.equal(formatUsd(1000), "$1,000");
  assert.equal(formatUsd(600), "$600.00");
  assert.equal(formatUsd(1), "$1.00");
  assert.equal(formatUsd(0.5), "$0.5000");
  assert.equal(formatUsd(0.012345), "$0.01235");
  assert.equal(formatUsd(82_600, { compact: true }), "$82.6k");
  assert.equal(formatUsd(111_800, { compact: true }), "$111.8k");
  assert.equal(formatUsd(510, { compact: true }), "$510");
  assert.equal(formatUsd(690, { compact: true }), "$690");
});
