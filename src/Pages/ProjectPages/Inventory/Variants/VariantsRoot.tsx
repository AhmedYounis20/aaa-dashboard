import { useCallback, useState } from "react";
import { Alert } from "@mui/material";
import { AppContent } from "@/Components";
import VariantModel from "@/interfaces/ProjectInterfaces/Inventory/Variants/VariantModel";
import { useTranslation } from "react-i18next";
import VariantsForm from "./VariantsForm";
import VariantAttributeValueModel from "@/interfaces/ProjectInterfaces/Inventory/Variants/VariantAttributeValueModel";
import { SmartChip } from "@/Components/UI/SmartChip";
import { getVariantPicture } from "@/Helper/variantAttachmentHelper";
import ImagePreview from "@/Components/Images/ImagePreview";
import { getVariantsPaginated } from "@/Apis/Inventory/VariantsApi";
import { useEntityListPage } from "@/hooks/queries";

/**
 * Variants stay server-side paginated. Query keys/hooks exist for detail/mutations;
 * Product/Variant card Components folders are owned by phase-c-product-variant.
 * List fetch errors are surfaced via AppContent ErrorState (Root-only; DataTable unchanged).
 */
const VariantsRoot = () => {
  const { t } = useTranslation();
  const {
    showForm,
    formType,
    selectedId,
    setFormType,
    handleShowForm,
    handleCloseForm,
    handleSelectId,
  } = useEntityListPage();
  const [reloadKey, setReloadKey] = useState(0);
  const [isError, setIsError] = useState(false);

  const onFetchData = useCallback(async (params: unknown) => {
    try {
      const result = await getVariantsPaginated(params as never);
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
    {
      Header: t(""),
      accessor: "variantAttachments",
      renderCell: ({ data }: { data: VariantModel }) => {
        const variantPicture = getVariantPicture(data);
        return (
          <ImagePreview
            src={variantPicture}
            alt={data.name || "attachment"}
            height={50}
            width={50}
          />
        );
      },
    },
    { Header: t("Name"), accessor: "name" },
    { Header: t("Code"), accessor: "code" },
    {
      Header: t("Attributes"),
      accessor: "variantAttributeValues",
      renderCell: (params: { value: VariantAttributeValueModel[] }) => {
        const attributes = params.value || [];
        return (
          <div>
            {attributes.map((attr) => (
              <SmartChip
                key={`${attr.attributeDefinitionId}-${attr.attributeValueId}`}
                value={`${attr.attributeDefinition?.name}: ${attr.attributeValue?.name}`}
              />
            ))}
          </div>
        );
      },
    },
    {
      Header: t("Created At"),
      accessor: "createdAt",
      Cell: ({ row }: { row: { original: VariantModel } }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
  ];

  return (
    <>
      {showForm ? (
        <VariantsForm
          formType={formType}
          id={selectedId}
          handleTranslate={t}
          handleCloseForm={handleCloseForm}
          afterAction={() => setReloadKey((prev) => prev + 1)}
        />
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            {t("VariantsCreatedViaProducts")}
          </Alert>
          <AppContent
            tableType="table"
            title="Variants Management"
            columns={columns}
            btn={false}
            handleShowForm={handleShowForm}
            changeFormType={setFormType}
            handleSelectId={handleSelectId}
            showEdit={true}
            showDelete={true}
            reloadKey={reloadKey}
            serverSidePagination={true}
            onFetchData={onFetchData}
            isError={isError}
            onRetry={() => {
              setIsError(false);
              setReloadKey((prev) => prev + 1);
            }}
          />
        </>
      )}
    </>
  );
};

export default VariantsRoot;
