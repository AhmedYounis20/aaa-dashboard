import { IconButton, Box, Typography, Button, useTheme } from "@mui/material";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { Add } from "@mui/icons-material";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputText from "../../../../../Components/Inputs/InputText";

const BarCodesInput: React.FC<{
  formType: FormTypes;
  barCodes: string[];
  handleTranslate: (key: string) => string;
  handleUpdate: (barCodes: string[]) => void;
}> = ({ formType, barCodes, handleUpdate, handleTranslate }) => {
  const theme = useTheme();

  const handleAddBarCode = () => {
    handleUpdate([...barCodes, ""]);
  };

  const handleRemoveBarCode = (index: number) => {
    const updated = [...barCodes];
    updated.splice(index, 1);
    handleUpdate(updated);
  };

  const handleBarCodeChange = (index: number, value: string) => {
    const updated = [...barCodes];
    updated[index] = value;
    handleUpdate(updated);
  };

  const renderBarCode = (code: string, index: number) => {
    const isDuplicate =
      code.trim().length > 0 &&
      barCodes.some((bc, idx) => idx !== index && bc.trim() === code.trim());

    return (
      <Box
        key={index}
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <InputText
            size='small'
            label={handleTranslate("NewBarcode")}
            value={code}
            disabled={formType === FormTypes.Details}
            onChange={(value) => handleBarCodeChange(index, value)}
            error={isDuplicate}
            helperText={
              isDuplicate ? handleTranslate("BARCODE_ALREADY_EXISTS") : ""
            }
          />
        </Box>
        {formType !== FormTypes.Details && (
          <IconButton
            onClick={() => handleRemoveBarCode(index)}
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
  };

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
            {handleTranslate("BarCodes")}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: "text.secondary",
              fontSize: ".75rem",
            }}
          >
            {handleTranslate("AddMultipleBarcodes")}
          </Typography>
        </Box>
        {formType !== FormTypes.Details && (
          <Button
            variant='outlined'
            startIcon={<Add />}
            onClick={handleAddBarCode}
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
        {barCodes.map((code, index) => renderBarCode(code, index))}
        {barCodes.length === 0 && (
          <Typography
            variant='body2'
            sx={{
              color: "text.secondary",
              fontSize: ".75rem",
              textAlign: "center",
            }}
          >
            {handleTranslate("NoBarcodesAdded")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BarCodesInput;
