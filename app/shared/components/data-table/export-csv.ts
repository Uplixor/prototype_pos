/**
 * Export filtered table rows as CSV and trigger a browser download.
 */
export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
  columns?: Array<{ key: keyof T & string; header: string }>,
): void {
  if (rows.length === 0) return;

  const keys =
    columns?.map((c) => c.key) ??
    (Object.keys(rows[0] ?? {}) as Array<keyof T & string>);
  const headers = columns?.map((c) => c.header) ?? keys;

  const escape = (value: unknown) => {
    const text = value == null ? "" : String(value);
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) => keys.map((key) => escape(row[key])).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
