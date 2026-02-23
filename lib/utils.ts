export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  // Reset times to compare strictly by date elements
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // If today: 2:34 PM
  if (today.getTime() === messageDate.getTime()) {
    return timeString;
  }

  // If this year, but older than today: Feb 15, 2:34 PM
  if (today.getFullYear() === messageDate.getFullYear()) {
    const dateString = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${dateString}, ${timeString}`;
  }

  // If previous year: 2023-02-15
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
