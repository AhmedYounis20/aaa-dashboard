import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAccountGuidesPaginated } from "@/Apis/Account/AccountGuidesApi";
import { AppContent } from "@/Components";
import AccountGuidesForm from "./AccountGuidesForm";
import { useEntityListPage } from "@/hooks/queries";
import { useCallback, useState } from "react";

/**
 * Account guides remain server-side paginated via AppContent.onFetchData.
 * List chrome uses useEntityListPage; Form mutations still call afterAction → reloadKey.
 * Fetch errors use AppContent ErrorState (Root-only; DataTable unchanged).
 */
const AccountGuidesRoot = () => {
  const { t } = useTranslation();
  const {
    showForm,
    formType,
    selectedId,
    setFormType,
    handleShowForm,
    handleCloseForm,
    handleSelectId,
    openAdd,
  } = useEntityListPage();
  const [reloadKey, setReloadKey] = useState(0);
  const [isError, setIsError] = useState(false);

  const onFetchData = useCallback(async (params: unknown) => {
    try {
      const result = await getAccountGuidesPaginated(params as never);
      if (!result?.isSuccess) {
        setIsError(true);
        return result;
      }
      setIsError(false);
      return result;
    } catch (error) {
      setIsError(true);
      throw error;
    }
  }, []);

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "NameSecondLanguage", accessor: "nameSecondLanguage" },
  ];

  return (
    <div className="w-full">
      <Box>
        {showForm && (
          <AccountGuidesForm
            id={selectedId}
            handleCloseForm={handleCloseForm}
            formType={formType}
            afterAction={() => setReloadKey((prev) => prev + 1)}
            handleTranslate={(key: string) => t(key)}
          />
        )}

        <AppContent
          tableType="table"
          title={t("AccountGuides")}
          columns={columns}
          addBtn
          btn
          startIcon
          actionBtn={openAdd}
          handleSelectId={handleSelectId}
          changeFormType={setFormType}
          handleShowForm={handleShowForm}
          defaultHiddenCols={["id", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]}
          reloadKey={reloadKey}
          serverSidePagination={true}
          onFetchData={onFetchData}
          isError={isError}
          onRetry={() => {
            setIsError(false);
            setReloadKey((prev) => prev + 1);
          }}
        />
      </Box>
    </div>
  );
};

export default AccountGuidesRoot;
