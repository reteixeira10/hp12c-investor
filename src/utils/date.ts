/**
 * Calculates the number of months between two dates.
 * The dates are expected in DD.MM.YYYY format.
 * @param date1 The first date string.
 * @param date2 The second date string.
 * @returns The number of months between the two dates, with a fraction representing the days.
 */
export const calculateMonthsBetweenDates = (date1: string, date2: string): number => {
  const [day1, month1, year1] = date1.split('.').map(Number);
  const [day2, month2, year2] = date2.split('.').map(Number);

  const d1 = new Date(year1, month1 - 1, day1);
  const d2 = new Date(year2, month2 - 1, day2);

  if (d1.getTime() > d2.getTime()) {
    // Swap dates if d1 is after d2
    const tempDate = d1;
    const tempDay = day1;
    const tempMonth = month1;
    const tempYear = year1;

    d1.setTime(d2.getTime());
    d2.setTime(tempDate.getTime());
  }


  let months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();

  const dayDiff = d2.getDate() - d1.getDate();
  
  months += dayDiff / 30.44; // Average number of days in a month

  return parseFloat(months.toFixed(2));
};
