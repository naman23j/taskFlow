export function formatDate(value) {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function isOverdue(value) {
  if (!value) {
    return false;
  }

  return new Date(value).getTime() < Date.now();
}
