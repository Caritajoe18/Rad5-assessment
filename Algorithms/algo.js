export function sumOfDigits(N) {
  let sum = 0;

  const numAsStr = N.toString();

  for (let i = 0; i < numAsStr.length; i++) {
    const digit = parseInt(numAsStr[i], 10);
    sum += digit;
  }

  return sum;
}

//console.log(sumOfDigits(389))

export function minCost(jewels) {
  let totalCost = 0;
  // counting each letter
  for (let i = 0; i < jewels.length; i++) {
    totalCost++;
    //nesting a loop inside to check for similar leters
    if (i + 1 < jewels.length && jewels[i] == jewels[i + 1]) {
      i++;
    }
  }

  return totalCost;
}

//console.log(minCost("erfrt"));

export function luckyLetter(letters) {
  const input = letters.toLowerCase();
  if (input.length !== 10) {
    return "letter must be 10 in number";
  }

  return letters[6];
}

//testing strictly if letters are 10 and all lowercase

// export function LuckyLetter(letters) {
//   // Validate input length and character type using regex
//   if (letters.length !== 10 || !/^[a-z]+$/.test(letters)) {
//     return "Invalid input: String must be 10 lowercase letters (a-z).";
//   }

//   return letters[6];
// }
//console.log(LuckyLetter("outofsigh"))

export function isCountCorrect(C, D, L) {
  const maxLegs = 4 * (C + D);
  let minLegs;

  if (C > 2 * D) {
      minLegs = 4 * (C - 2 * D + D);
  } else {
      minLegs = 4 * D;
  }

  if (minLegs <= L && L <= maxLegs && L % 4 === 0) {
      return "Yes";
  } else {
      return "No";
  }
}

