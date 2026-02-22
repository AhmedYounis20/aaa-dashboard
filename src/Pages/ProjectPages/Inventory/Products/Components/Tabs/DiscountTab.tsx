import React from "react";
import { Box, Typography } from "@mui/material";
import ProductDiscountCard from "../ProductDiscountCard";
import { FormTypes } from "../../../../../../interfaces/Components/FormType";
import ProductInputModel from "../../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

interface DiscountTabProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  handleTranslate: (key: string) => string;
}

const DiscountTab: React.FC<DiscountTabProps> = ({
  formType,
  model,
  setModel,
  handleTranslate,
}) => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant='h6'
          sx={{
            fontWeight: 600,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: "1rem",
          }}
        >
          {handleTranslate("DiscountDetails")}
        </Typography>
      </Box>
      <Box>
        <ProductDiscountCard
          formType={formType}
          model={model}
          setModel={setModel}
          handleTranslate={handleTranslate}
        />
      </Box>
    </>
  );
};

export default DiscountTab;
