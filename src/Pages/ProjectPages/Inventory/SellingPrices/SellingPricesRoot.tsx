import { useEffect, useState } from 'react';
import { AppContent } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import SellingPricesForm from './SellingPricesForm';
import { Box } from '@mui/material';
import Loader from '../../../../Components/Loader';
import { getSellingPrices } from "../../../../Apis/Inventory/SellingPricesApi";
import  SellingPriceModel  from "../../../../interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";
import { useTranslation } from 'react-i18next';

const SellingPricesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<SellingPriceModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  
  const fetchData = async () => {
    const result = await getSellingPrices();
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
            <SellingPricesForm
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
              title={t("SellingPrices")}
              columns={columns}
              btnName={t("AddNew")}
              addBtn
              btn
              startIcon
              showDeleteButtonIf={(e : SellingPriceModel)=> e.isDeletable ?? false}
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

export default SellingPricesRoot
