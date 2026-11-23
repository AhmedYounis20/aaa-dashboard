import type { TFunction } from "i18next";

/** AG Grid filter/overlay strings mapped through i18n. */
export function getAgGridLocaleText(t: TFunction) {
  return {
    contains: t("contains"),
    notContains: t("notContains"),
    equals: t("equals"),
    notEqual: t("notEqual"),
    startsWith: t("startsWith"),
    endsWith: t("endsWith"),
    blank: t("blank"),
    notBlank: t("notBlank"),
    filterOoo: t("Filter"),
    loadingOoo: t("Loading"),
    noRowsToShow: t("No rows to show"),
  };
}
