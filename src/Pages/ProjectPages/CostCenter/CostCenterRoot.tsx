import { useState } from 'react';
import { FormTypes } from '../../../interfaces/Components';

import Loader from '../../../Components/Loader';
import { AppContent } from '../../../Components';
import { useGetCostCenterQuery } from '../../../Apis/CostCenterApi';
import CostCenterForm from './CostCenterForm';

const columns = [
    {
        Header: "Code",
        accessor: "code",
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
    const [, setSelectedId] = useState<string>("");
    const [parentId, setParentId] = useState<string | null>(null);
    const { data, isLoading } = useGetCostCenterQuery(null);
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
                            parentId={parentId}
                            formType={formType}
                            handleCloseForm={handleCloseForm}
                        />
                    )}

                    {data?.result && (
                        <AppContent
                            tableType="tree"
                            data={data?.result}
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
}

export default CostCenterRoot;
