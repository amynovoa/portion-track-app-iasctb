
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getResetDate(resetTime: string): Date {
  const now = new Date();
  const [hours, minutes] = resetTime.split(':').map(Number);
  
  const resetDate = new Date(now);
  resetDate.setHours(hours, minutes, 0, 0);
  
  // If current time is before reset time, the reset happened yesterday
  if (now < resetDate) {
    resetDate.setDate(resetDate.getDate() - 1);
  }
  
  return resetDate;
}

export function shouldResetLog(lastLogDate: string, resetTime: string): boolean {
  console.log('=== shouldResetLog ===');
  console.log('lastLogDate:', lastLogDate);
  console.log('resetTime:', resetTime);
  
  const now = new Date();
  const [hours, minutes] = resetTime.split(':').map(Number);
  
  // Get today's date string
  const todayDateString = getTodayDate();
  console.log('todayDateString:', todayDateString);
  
  // If the log date is not today, we need to reset
  if (lastLogDate !== todayDateString) {
    console.log('Log date is not today, should reset: true');
    return true;
  }
  
  // If the log date IS today, check if we've passed the reset time
  // and the log was created before the reset time
  const resetDateToday = new Date(now);
  resetDateToday.setHours(hours, minutes, 0, 0);
  
  // Parse the log date to get its timestamp
  const logDate = new Date(lastLogDate + 'T00:00:00');
  
  // If we're past the reset time today and the log is from before reset time,
  // we should NOT reset (the log is already for the current day)
  console.log('Log date matches today, should reset: false');
  return false;
}
