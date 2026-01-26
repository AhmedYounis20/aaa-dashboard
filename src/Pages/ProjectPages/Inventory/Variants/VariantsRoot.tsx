import { useState } from "react";
import { AppContent } from "../../../../Components";
import VariantModel from "../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantModel";
import { useTranslation } from "react-i18next";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import VariantsForm from "./VariantsForm";
import VariantAttributeValueModel from "../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantAttributeValueModel";
import { SmartChip } from "../../../../Components/UI/SmartChip";
import { getVariantPicture } from "../../../../Helper/variantAttachmentHelper";
import ImagePreview from "../../../../Components/Images/ImagePreview";
import { getVariantsPaginated } from "../../../../Apis/Inventory/VariantsApi";

const VariantsRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);

  const { t } = useTranslation();

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
    {
      Header: t("Name"),
      accessor: "name",
    },
    {
      Header: t("Code"),
      accessor: "code",
    },
    {
      Header: t("Attributes"),
      accessor: "variantAttributeValues",
      renderCell: (params: { value: VariantAttributeValueModel[] }) => {
        console.log("paraps:", params);
        const attributes = params.value || [];
        return (
          <div>
            {attributes.map((attr) => (
              <SmartChip
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

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  const handleCloseForm = () => {
    setShowForm(false);
  };



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
        <AppContent
          tableType="table"
          title={t("Variants Management")}
          columns={columns}
          startIcon
          actionBtn={() => {
            setFormType(FormTypes.Add);
            handleShowForm();
          }}
          handleShowForm={handleShowForm}
          changeFormType={setFormType}
          handleSelectId={handleSelectId}
          showedit={true}
          showdelete={true}
          reloadKey={reloadKey}
          serverSidePagination={true}
          onFetchData={getVariantsPaginated}
        />
      )}
    </>
  );
};

export default VariantsRoot;
