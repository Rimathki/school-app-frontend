function padTo2Digits(num: number): string {
  return num.toString().padStart(2, "0");
}

export function formatDateTime(dateString?: string | Date): string | undefined {
  if (!dateString) return;

  const date = new Date(dateString);

  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
}

export function formatDate(dateString?: string | Date, addYear?: number): string | undefined {
  if (!dateString) return;

  const date = new Date(dateString);
  if (addYear) date.setFullYear(date.getFullYear() + addYear);

  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}

export function formatTime(dateString?: string | Date): string | undefined {
  if (!dateString) return;

  const date = new Date(dateString);
  return [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds()),
  ].join(":");
}

export function formatQuery(query?: { page: number; limit: number; filter: string | null }): string {
  if (!query) return "";

  const queryString = [];

  if (query.page) queryString.push(`page=${query.page}`);
  if (query.limit) queryString.push(`limit=${query.limit}`);
  if (query.filter) queryString.push(`filter=${query.filter}`);

  return queryString.length ? `${queryString.join("&")}` : "";
}

export function getDateByISOString(date: string | Date): string {
  return new Date(date).toISOString().split(".")[0] + "Z";
}
  