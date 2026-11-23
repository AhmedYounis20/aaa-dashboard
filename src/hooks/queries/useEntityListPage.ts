import { useCallback, useState } from "react";
import { FormTypes } from "@/interfaces/Components/FormType";

export interface UseEntityListPageOptions {
  /** When true, tracks parentId for tree/sub-ledger add-under-node flows. */
  withParent?: boolean;
}

/**
 * Shared list-page chrome: form open state, selected row, optional tree parent.
 * Pair with useEntityList / AppContent (see PackingUnitsRoot / BanksRoot).
 */
export function useEntityListPage(options: UseEntityListPageOptions = {}) {
  const { withParent = false } = options;

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  const handleShowForm = useCallback(() => setShowForm(true), []);
  const handleCloseForm = useCallback(() => setShowForm(false), []);
  const handleSelectId = useCallback((id: string) => setSelectedId(id), []);

  const openAdd = useCallback(() => {
    if (withParent) setParentId(null);
    setSelectedId("");
    setFormType(FormTypes.Add);
    setShowForm(true);
  }, [withParent]);

  const openAddUnderParent = useCallback((id: string | null) => {
    setParentId(id);
    setSelectedId("");
    setFormType(FormTypes.Add);
    setShowForm(true);
  }, []);

  return {
    showForm,
    formType,
    selectedId,
    parentId: withParent ? parentId : undefined,
    setFormType,
    setSelectedId,
    setParentId: withParent ? setParentId : undefined,
    handleShowForm,
    handleCloseForm,
    handleSelectId,
    openAdd,
    openAddUnderParent,
  };
}
