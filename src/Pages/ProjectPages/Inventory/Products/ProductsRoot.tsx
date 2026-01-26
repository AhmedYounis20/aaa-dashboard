import { useEffect, useState } from 'react';
import { getProducts } from "../../../../Apis/Inventory/ProductsApi";
import { FormTypes } from '../../../../interfaces/Components/FormType';
import ProductsForm from './ProductsForm';
import Loader from '../../../../Components/Loader';
import { AppContent } from '../../../../Components';
import ProductModel from '../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductModel';
import { useTranslation } from 'react-i18next';
import { ProductType } from '../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductType';
import { ItemNodeType } from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemNodeType';
import { getEnumString } from '../../../../Helper/enumHelper';
import { getProductPicture } from '../../../../Helper/productAttachmentHelper';
// import ProductAttachmentModel from '../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductAttachmentModel';
import ImagePreview from '../../../../Components/Images/ImagePreview';
import { NodeType } from '../../../../interfaces/Components/NodeType';

const ProductsRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [data, setData] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterType] = useState<string>('all');
  const { t } = useTranslation();

  const columns = [
    {
      Header: t("Picture"),
      accessor: "productAttachments",
      renderCell: ({data}: {data:ProductModel}) => {
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
    {
      Header: t("Code"),
      accessor: "code",
    },
    {
      Header: t("Name"),
      accessor: "name",
    },
    {
      Header: t("Name Second Language"),
      accessor: "nameSecondLanguage",
    },
    {
      Header: t("Type"),
      accessor: "productType",
      renderCell: (row:{value:any}) => {
        return getEnumString(ProductType, row.value);
        return row.value;
      },
    },
    {
      Header: t("Node Type"),
      accessor: "nodeType",
      renderCell: (row : {value:any} ) => {
        return getEnumString(ItemNodeType, row.value);
      },
    }
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let result = await getProducts();
      
      if (result.isSuccess) {
        setData(result.result || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  const handleAdd = () => {
    setFormType(FormTypes.Add);
    setSelectedId("");
    setParentId(null);
    handleShowForm();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedId("");
    setParentId(null);
  };

  const handleAfterAction = () => {
    fetchData();
  };


  if (isLoading) {
    return <Loader />;
  }

  return (
    <>

      {showForm ? (
        <ProductsForm
          formType={formType}
          id={selectedId}
          parentId={parentId}
          handleCloseForm={handleCloseForm}
          afterAction={handleAfterAction}
          handleTranslate={t}
        />
      ) :      <AppContent
        tableType="tree"
        title={t("Products Management")}
        data={data}
        columns={columns}
        btnName={t("AddNew")}
        addBtn
        btn
        startIcon
        actionBtn={handleAdd}
        handleShowForm={handleShowForm}
        changeFormType={setFormType}
        handleSelectId={handleSelectId}
        handleSelectParentId={setParentId}
        showedit={true}
        showdelete={true}
        showAddButtonIf={(data)=> data.nodeType === NodeType.Category}
      /> }
    </>
  );
};

export default ProductsRoot;



