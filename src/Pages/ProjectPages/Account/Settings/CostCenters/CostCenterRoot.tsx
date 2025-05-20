import { useEffect, useState } from "react";
import { FormTypes } from "../../../../../interfaces/Components";

import Loader from "../../../../../Components/Loader";
import { AppContent } from "../../../../../Components";
import { getCostCenters } from "../../../../../Apis/Account/CostCenterApi";
import CostCenterForm from "./CostCenterForm";
import { CostCenterModel } from "../../../../../interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";

const columns = [
  {
    Header: "",
    accessor: "",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Name (Second Language)",
    accessor: "nameSecondLanguage",
  },
];

const CostCenterRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [data, setData] = useState<CostCenterModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const result = await getCostCenters();
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
    <div className="h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <CostCenterForm
              id={selectedId}
              parentId={parentId}
              formType={formType}
              handleCloseForm={handleCloseForm}
              afterAction =  {()=> fetchData()}
            />
          )}

          {data && (
            <AppContent
              tableType="tree"
              data={data}
              title="cost center"
              // actionBtn={() => setIsOpen(prev => !prev)}
              btn
              addBtn
              actionBtn={() => {
                setParentId("");
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName="add new"
              startIcon
              columns={columns}
              showdelete={false}
              showedit={false}
              handleSelectId={handleSelectId}
              handleSelectParentId={setParentId}
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
        </>
      )}
    </div>
  );
};

export default CostCenterRoot;
