/** Mantém nome(s) anterior(es) e censura o último sobrenome (ex.: "Hurben Delabary S******"). */
export function formatWinnerDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  const last = parts[parts.length - 1]!;
  const masked =
    last.length <= 1 ? "*" : `${last[0]!}${"*".repeat(6)}`;
  return `${parts.slice(0, -1).join(" ")} ${masked}`;
}
