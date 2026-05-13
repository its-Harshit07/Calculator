const regex = /(?:^|\s)([+\-×÷])\s+((?:(?!\s[+\-×÷]\s).)*)$/;

const testCases = [
  "10 + 2",
  "10 + 2 * 3",
  "17 + ( 3 × -5 )",
  "10 - -2",
  "5 × ( 6 - ( 2 + 1 ) )",
  "( 5 + 5 ) × 2",
];

testCases.forEach(tc => {
  const match = tc.match(regex);
  if (match) {
    console.log(`"${tc}" -> OP: "${match[1]}", OPERAND: "${match[2]}"`);
  } else {
    console.log(`"${tc}" -> NO MATCH`);
  }
});
