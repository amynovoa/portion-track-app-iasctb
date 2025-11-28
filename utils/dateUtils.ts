
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
  
  if (now < resetDate) {
    resetDate.setDate(resetDate.getDate() - 1);
  }
  
  return resetDate;
}

export function shouldResetLog(lastLogDate: string, resetTime: string): boolean {
  const lastLog = new Date(lastLogDate);
  const resetDate = getResetDate(resetTime);
  
  return lastLog < resetDate;
}
