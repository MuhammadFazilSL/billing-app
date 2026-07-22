export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const convertWholeNumber = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertWholeNumber(n % 100) : '');
    if (n < 100000) return convertWholeNumber(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convertWholeNumber(n % 1000) : '');
    if (n < 10000000) return convertWholeNumber(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convertWholeNumber(n % 100000) : '');
    return convertWholeNumber(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convertWholeNumber(n % 10000000) : '');
  };

  const wholePart = Math.floor(num);
  const decimalPart = Math.round((num - wholePart) * 100);

  let words = convertWholeNumber(wholePart) + ' Rupees';

  if (decimalPart > 0) {
    words += ' and ' + convertWholeNumber(decimalPart) + ' Paise';
  }

  return words + ' Only';
}
