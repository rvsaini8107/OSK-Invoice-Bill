const convertToWords = (num) => {
  if (num === 0) return "Zero";

  const belowTen = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const belowTwenty = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const belowHundred = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const aboveHundred = ["", "Thousand", "Million"];

  const words = [];

  const helper = (n) => {
    if (n < 10) return belowTen[n];
    if (n < 20) return belowTwenty[n - 10];
    if (n < 100)
      return (
        belowHundred[Math.floor(n / 10)] +
        (n % 10 ? " " + belowTen[n % 10] : "")
      );
    if (n < 1000)
      return (
        belowTen[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + helper(n % 100) : "")
      );
  };

  let thousandCounter = 0;
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk) {
      words.unshift(
        helper(chunk) +
          (aboveHundred[thousandCounter]
            ? " " + aboveHundred[thousandCounter]
            : "")
      );
    }
    num = Math.floor(num / 1000);
    thousandCounter++;
  }

  return words.join(" ").trim();
};
export default convertToWords;