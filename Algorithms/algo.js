function sumOfDigits(N) {
  let sum = 0;

  const numAsStr = N.toString();

  for (let i = 0; i < numAsStr.length; i++) {
    const digit = parseInt(numAsStr[i], 10);
    sum += digit;
  }

  return sum;
}

//console.log(sumOfDigits(389))

function minCost(jewels) {
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

function luckyLetter(letters) {
  const input = letters.toLowerCase();
  if (input.length !== 10) {
    return "letter must be 10 in number";
  }

  return letters[6];
}

//testing strictly if letters are 10 and all lowercase

function LuckyLetter(letters) {
  // Validate input length and character type using regex
  if (letters.length !== 10 || !/^[a-z]+$/.test(letters)) {
    return "Invalid input: String must be 10 lowercase letters (a-z).";
  }

  return letters[6];
}
//console.log(LuckyLetter("outofsigh"))

function isCountCorrect(cats, dogs, legs) {
  let minDogLegs;
  let maxDogLegs;

  if (dogs >= 2 * cats) {
    minDogLegs = dogs - 2 * cats;
  } else {
    minDogLegs = 0;
  }

  maxDogLegs = dogs * 4;

  if (legs >= minDogLegs * 4 + cats * 2 && legs <= maxDogLegs * 4) {
    return "Yes";
  } else {
    return "No";
  }
}

//console.log(isCountCorrect(3));
