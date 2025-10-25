import { useEffect, useState } from "react";
import { AppContent } from "../../../../Components";
import { FormTypes } from "../../../../interfaces/Components";
import { Box } from "@mui/material";
import Loader from "../../../../Components/Loader";
import { getAttributeDefinitions } from "../../../../Apis/Inventory/AttributeDefinitionsApi";
import AttributeModel from "../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel";
import { useTranslation } from "react-i18next";
import AttributesForm from "./AttributesForm";
import { StatusChip } from "../../../../Components/UI/StatusChip";

const AttributesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<AttributeModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  const fetchData = async () => {
    const result = await getAttributeDefinitions();
    if (result && result.isSuccess) {
      setData(result.result);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  const columns = [
    { Header: t("Name"), accessor: "name" },
    { Header: t("NameSecondLanguage"), accessor: "nameSecondLanguage" },
    {
      Header: t("Status"),
      accessor: "isActive",
      renderCell: (params: any) => <StatusChip value={params.value} />,
    },
  ];

  return (
    <div className='w-full'>
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {showForm && (
            <AttributesForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
              afterAction={() => fetchData()}
            />
          )}

          {!isLoading && (
            <AppContent
              tableType='table'
              data={data}
              title={t("Attributes")}
              columns={columns}
              btnName={t("AddNew")}
              addBtn
              btn
              startIcon
              actionBtn={() => {
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              handleSelectId={handleSelectId}
              changeFormType={setFormType}
              handleShowForm={handleShowForm}
              defaultHiddenCols={[
                "id",
                "createdAt",
                "createdBy",
                "modifiedAt",
                "modifiedBy",
              ]}
            />
          )}
        </Box>
      )}
    </div>
  );
};

export default AttributesRoot;
