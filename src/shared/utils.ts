export function toDate(date: string) {
  return new Date(date).toLocaleDateString('en-uk')
}