import { useEffect, useState } from 'react';
import { AppContent } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import ManufacturerCompaniesForm from './ManufacturerCompaniesForm';
import { Box } from '@mui/material';
import Loader from '../../../../Components/Loader';
import { getManufacturerCompanies } from "../../../../Apis/Inventory/ManufacturerCompaniesApi";
import  ManufacturerCompanyModel  from "../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { useTranslation } from 'react-i18next';

const ManufacturerCompaniesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<ManufacturerCompanyModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  
  const fetchData = async () => {
    const result = await getManufacturerCompanies();
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
            <ManufacturerCompaniesForm
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
              title={t("ManufacturerCompanies")}
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

export default ManufacturerCompaniesRoot
