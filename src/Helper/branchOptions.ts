import { NodeType } from "@/interfaces/Components/NodeType";
import BranchModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Branches/BranchModel";

const SYSTEM_BRANCH_MARKERS = [
  "stock under transfer",
  "stock under-transfer",
  "مخزون تحت التحويل",
  "بضاعة تحت التحويل",
];

function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

/** Domain branches that can be used as operational locations (excludes system staging). */
export function filterOperationalBranches(
  branches: BranchModel[] | null | undefined
): BranchModel[] {
  return (branches ?? []).filter((branch) => {
    if (branch.nodeType !== NodeType.Domain) return false;
    const haystack = `${normalize(branch.name)} ${normalize(branch.nameSecondLanguage)}`;
    return !SYSTEM_BRANCH_MARKERS.some((marker) => haystack.includes(marker));
  });
}

/** Prefer a stable default: Latin/English display name when present, else first operational branch. */
export function pickDefaultBranchId(branches: BranchModel[]): string | undefined {
  if (!branches.length) return undefined;
  const withLatin = branches.find((b) => /[A-Za-z]/.test(b.nameSecondLanguage || b.name || ""));
  return (withLatin ?? branches[0])?.id;
}

export function branchDisplayName(branch: BranchModel, language: string): string {
  if (language?.startsWith("ar")) {
    return branch.name || branch.nameSecondLanguage || branch.id;
  }
  return branch.nameSecondLanguage || branch.name || branch.id;
}
