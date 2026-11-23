/** Pick the bilingual name that matches the active UI language. */
export function localizedEntityName(
  entity: { name?: string | null; nameSecondLanguage?: string | null } | null | undefined,
  language: string
): string {
  if (!entity) return "";
  const primary = (entity.name ?? "").trim();
  const secondary = (entity.nameSecondLanguage ?? "").trim();
  if (language?.startsWith("ar")) {
    return primary || secondary;
  }
  return secondary || primary;
}
