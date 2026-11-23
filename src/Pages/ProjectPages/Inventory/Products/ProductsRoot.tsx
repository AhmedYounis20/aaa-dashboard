import { lazy, Suspense } from "react";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import ProductModel from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductModel";
import { useTranslation } from "react-i18next";
import { ProductType } from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductType";
import { ProductNodeType } from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductNodeType";
import { getEnumString } from "@/Helper/enumHelper";
import { getProductPicture } from "@/Helper/productAttachmentHelper";
import ImagePreview from "@/Components/Images/ImagePreview";
import { useEntityListPage, useProductsList } from "@/hooks/queries";

const ProductsForm = lazy(() => import("./ProductsForm"));

const ProductsRoot = () => {
  const { t } = useTranslation();
  const {
    showForm,
    formType,
    selectedId,
    parentId,
    setFormType,
    setParentId,
    handleShowForm,
    handleCloseForm,
    handleSelectId,
    openAdd,
  } = useEntityListPage({ withParent: true });

  const { data = [], isLoading, isFetching, isError, refetch } = useProductsList();

  const columns = [
    {
      Header: t("Picture"),
      accessor: "productAttachments",
      renderCell: ({ data }: { data: ProductModel }) => {
        const productPicture = getProductPicture(data);
        return (
          <ImagePreview
            src={productPicture}
            alt={data.name || "attachment"}
            height={50}
            width={50}
          />
        );
      },
    },
    { Header: t("Code"), accessor: "code" },
    { Header: t("Name"), accessor: "name" },
    { Header: t("Name Second Language"), accessor: "nameSecondLanguage" },
    {
      Header: t("Type"),
      accessor: "productType",
      renderCell: (row: { value: unknown }) => getEnumString(ProductType, row.value as ProductType),
    },
    {
      Header: t("Node Type"),
      accessor: "nodeType",
      renderCell: (row: { value: unknown }) =>
        getEnumString(ProductNodeType, row.value as ProductNodeType),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {showForm ? (
        <Suspense fallback={<Loader />}>
          <ProductsForm
            formType={formType}
            id={selectedId}
            parentId={parentId ?? null}
            handleCloseForm={handleCloseForm}
            afterAction={() => void refetch()}
            handleTranslate={t}
          />
        </Suspense>
      ) : (
        <AppContent
          tableType="tree"
          title="Products Management"
          data={data}
          columns={columns}
          btnName={t("AddNew")}
          addBtn
          btn
          startIcon
          actionBtn={openAdd}
          handleShowForm={handleShowForm}
          changeFormType={setFormType}
          handleSelectId={handleSelectId}
          handleSelectParentId={setParentId}
          showEdit={true}
          showDelete={true}
          loading={isFetching}
          isError={isError}
          onRetry={() => void refetch()}
          onRefresh={() => void refetch()}
          showAddButtonIf={(row) => row.nodeType === ProductNodeType.Category}
        />
      )}
    </>
  );
};

export default ProductsRoot;
