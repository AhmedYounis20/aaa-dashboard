import { useEffect, useState } from 'react';
import { AppContent } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import PackingUnitsForm from './PackingUnitsForm';
import { Box } from '@mui/material';
import Loader from '../../../../Components/Loader';
import { getPackingUnits } from "../../../../Apis/Inventory/PackingUnitsApi";
import  PackingUnitModel  from "../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel";
import { useTranslation } from 'react-i18next';

const PackingUnitsRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<PackingUnitModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  
  const fetchData = async () => {
    const result = await getPackingUnits();
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
    { Header: t('Name'), accessor: 'name' },
    { Header: t('NameSecondLanguage'), accessor: 'nameSecondLanguage' },
  ];

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {showForm && (
            <PackingUnitsForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
              afterAction={()=> fetchData()}
            />
          )}

          {!isLoading && (
            <AppContent
              tableType="table"
              data={data}
              title={t("PackingUnits")}
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
}

export default PackingUnitsRoot
