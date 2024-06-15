import { isDoExpression } from '@babel/types';
import { useGetAccountGuidesQuery } from '../../../Apis/AccountGuidesApi'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { useParams } from 'react-router';
import { DataTable } from '../../../Components';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
    editable: true,
  },
  {
    field: "nameSecondLanguage",
    headerName: "Name Second Language",
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    headerName: "Created at",
    width: 150,
    editable: true,
  },
  {
    field: "modifiedAt",
    headerName: "Modified at",
    width: 150,
    editable: true,
  },
  {
    field: "",
    headerName: "Operations",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 300,
    headerAlign: "center",
    renderCell: (params: GridRenderCellParams<any, string>) => (
      <strong></strong>
    ),
  },
];



const AccountGuidesRoot = () => {
    const {data,isLoading}= useGetAccountGuidesQuery(null);
    
  return <div>{(data?.result) && <DataTable data={data.result} defaultHiddenColumns={['id','createdAt','createdBy','modifiedAt','modifiedBy']} />}</div>;
}

export default AccountGuidesRoot
