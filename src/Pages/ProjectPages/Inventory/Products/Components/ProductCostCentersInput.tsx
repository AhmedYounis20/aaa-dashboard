import { useEffect, useState } from "react";
import { IconButton, Box, Typography, Button, useTheme } from "@mui/material";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { CostCenterModel } from "../../../../../interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import { getCostCenters } from "../../../../../Apis/Account/CostCenterApi";
import { NodeType } from "../../../../../interfaces/Components/NodeType";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import ProductCostCenterModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductCostCenterModel";
import { Add } from "@mui/icons-material";
import { v4 as uuid } from "uuid";
import { RiDeleteBin6Line } from "react-icons/ri";

const ProductCostCentersInput: React.FC<{
  formType: FormTypes;
  productCostCenters: ProductCostCenterModel[];
  handleUpdate: (costCenters: ProductCostCenterModel[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({
  formType,
  productCostCenters,
  handleUpdate,
  handleTranslate,
  errors = {},
}) => {
  const theme = useTheme();
  const [costCenters, setCostCenters] = useState<CostCenterModel[]>([]);

  useEffect(() => {
    if (formType !== FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getCostCenters();
        if (result?.result) {
          setCostCenters(
            result.result.filter((e) => e.nodeType === NodeType.Domain),
          );
        }
      };
      fetchData();
    }
  }, [formType]);

  const createCostCenter = (): ProductCostCenterModel => ({
    id: uuid(),
    costCenterId: null,
    percent: 0,
  });

  const handleCostCenterChange = (
    id: string | undefined,
    value: string | null,
  ) => {
    const updated = productCostCenters.map((item) => {
      if (item.id === id) {
        const selected = costCenters.find((c) => c.id === value);
        return {
          ...item,
          costCenterId: value,
          name: selected?.name ?? "",
          nameSecondLanguage: selected?.nameSecondLanguage ?? "",
        };
      }
      return item;
    });
    handleUpdate(updated);
  };

  const handlePercentChange = (
    id: string | undefined,
    value: number | null,
  ) => {
    const updated = productCostCenters.map((item) =>
      item.id === id ? { ...item, percent: value ?? 0 } : item,
    );
    handleUpdate(updated);
  };

  const handleDelete = (id: string | undefined) => {
    handleUpdate(productCostCenters.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    handleUpdate([...productCostCenters, createCostCenter()]);
  };

  const renderCostCenter = (item: ProductCostCenterModel, index: number) => (
    <Box
      key={item.id ?? item.costCenterId ?? uuid()}
      sx={{
        display: "flex",
        gap: 2,
        mb: 2,
        alignItems: "center",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <InputAutoComplete
          size='small'
          options={costCenters?.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
          label={handleTranslate("SelectCostCenter")}
          value={item.costCenterId}
          disabled={formType === FormTypes.Details}
          onChange={(value: string | null) =>
            handleCostCenterChange(item.id, value)
          }
          multiple={false}
          handleBlur={null}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8f9fa",
              borderRadius: "0.5rem",
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
          }}
          error={!!errors[`costCenters[${index}].costCenterId`]}
          helperText={handleTranslate(
            errors[`costCenters[${index}].costCenterId`],
          )}
        />
      </Box>
      <Box sx={{ width: "150px" }}>
        <InputNumber
          label={handleTranslate("Percentage")}
          variant='outlined'
          fullWidth
          size='small'
          disabled={formType === FormTypes.Details}
          value={item.percent ?? 0}
          inputType='percent'
          onChange={(value) => handlePercentChange(item.id, value)}
          error={!!errors[`costCenters[${index}].percent`]}
          helperText={handleTranslate(errors[`costCenters[${index}].percent`])}
        />
      </Box>
      {formType !== FormTypes.Details && (
        <IconButton
          onClick={() => handleDelete(item.id)}
          sx={{
            borderRadius: ".325rem",
            color: theme.palette.error.main,
            "&:hover": { color: theme.palette.error.main },
          }}
        >
          <RiDeleteBin6Line fontSize='medium' />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Box>
          <Typography
            variant='h6'
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              opacity: 0.75,
              fontSize: "0.875rem",
            }}
          >
            {handleTranslate("CostCenters")}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: "text.secondary",
              fontSize: ".75rem",
            }}
          >
            {handleTranslate("AddMultipleCostCenters")}
          </Typography>
        </Box>
        {formType !== FormTypes.Details && (
          <Button
            variant='outlined'
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              borderRadius: "0.5rem",
              textTransform: "none",
              color: "text.primary",
              borderColor: "divider",
              px: "0.625rem",
              py: "0.175rem",
              "&:hover": {
                borderColor: "divider",
                boxShadow: "none",
                backgroundColor: theme.palette.background.default,
              },
            }}
          >
            {handleTranslate("Add")}
          </Button>
        )}
      </Box>

      <Box>
        {productCostCenters.map((item, index) => renderCostCenter(item, index))}
        {productCostCenters.length === 0 && (
          <Typography
            variant='body2'
            sx={{
              color: "text.secondary",
              fontSize: ".75rem",
              textAlign: "center",
            }}
          >
            {handleTranslate("NoCostCentersAdded")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductCostCentersInput;
