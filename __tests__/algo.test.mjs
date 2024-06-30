import { sumOfDigits, luckyLetter, isCountCorrect, minCost } from "../Algorithms/algo.js";

describe("sumOfDigits function", () => {
    test("should return the correct sum of digits", () => {
      expect(sumOfDigits(389)).toBe(20);
      expect(sumOfDigits(12345)).toBe(15);
      expect(sumOfDigits(0)).toBe(0);
    });
  });

  describe("minCost function", () => {
    test("should return the correct minimum cost", () => {
      expect(minCost("4")).toBe(1);
      expect(minCost("ssss")).toBe(2);
      expect(minCost("ssas")).toBe(3);
      expect(minCost("sa")).toBe(2);
      expect(minCost("sS")).toBe(2);
    });
  });

  describe("luckyLetter function", () => {
    test("should return the 7th letter for valid input", () => {
      expect(luckyLetter("outofsight")).toBe("i");
      expect(luckyLetter("abcdefghij")).toBe("g");
    });
  
    test("should return an error message for invalid input length", () => {
      expect(luckyLetter("carita")).toBe("letter must be 10 in number");
    });
  });

  describe("isCountCorrect function", () => {
    test("should return 'Yes' when legs count is correct", () => {
      expect(isCountCorrect(1,1,4)).toBe("Yes");
      expect(isCountCorrect(1, 1, 8)).toBe("Yes");
    });
  
    test("should return 'No' when legs count is incorrect", () => {
      expect(isCountCorrect(1, 1, 2)).toBe("No");
      expect(isCountCorrect(0, 0, 1)).toBe("No");
      expect(isCountCorrect(3)).toBe("No");
    });
  });

  