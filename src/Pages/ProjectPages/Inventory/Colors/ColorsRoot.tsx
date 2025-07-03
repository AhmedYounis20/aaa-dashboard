import { useEffect, useState } from 'react';
import { AppContent } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import ColorsForm from './ColorsForm';
import { Box } from '@mui/material';
import Loader from '../../../../Components/Loader';
import { getColors } from "../../../../Apis/Inventory/ColorsApi";
import ColorModel from "../../../../interfaces/ProjectInterfaces/Inventory/Colors/ColorModel";
import { useTranslation } from 'react-i18next';

const ColorsRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<ColorModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  const fetchData = async () => {
    const result = await getColors();
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
  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {showForm && (
            <ColorsForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
              afterAction={() => fetchData()}
            />
          )}

          {!isLoading && (
            <AppContent
              tableType="table"
              data={data}
              title={t("Colors")}
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
}

export default ColorsRoot; 