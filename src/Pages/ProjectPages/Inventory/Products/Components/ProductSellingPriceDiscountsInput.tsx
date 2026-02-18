import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { getSellingPrices } from "../../../../../Apis/Inventory/SellingPricesApi";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import InputText from "../../../../../Components/Inputs/InputText";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import {
  DiscountType,
  DiscountTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/DiscountType";
import ProductSellingPriceDiscountModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductSellingPriceDiscountModel";
import SellingPriceModel from "../../../../../interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";

const ProductSellingPriceDiscountsInput: React.FC<{
  formType: FormTypes;
  productSellingPriceDiscounts: ProductSellingPriceDiscountModel[];
  handleUpdate: (
    sellingPriceDiscounts: ProductSellingPriceDiscountModel[],
  ) => void;
  handleTranslate: (key: string) => string;
}> = ({
  formType,
  productSellingPriceDiscounts,
  handleUpdate,
  handleTranslate,
}) => {
  const theme = useTheme();

  useEffect(() => {
    if (formType !== FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getSellingPrices();
        if (result?.result) {
          const fetchedPrices: SellingPriceModel[] = result.result;

          const missingDiscounts = fetchedPrices
            .filter(
              (e) =>
                !productSellingPriceDiscounts.some(
                  (a) => a.sellingPriceId == e.id,
                ),
            )
            .map((e) => ({
              discount: 0,
              discountType: DiscountType.Percent,
              sellingPriceId: e.id,
              name: e.name,
              nameSecondLanguage: e.nameSecondLanguage,
            }));

          const enrichedExisting = productSellingPriceDiscounts.map((item) => {
            if (!item.name || !item.nameSecondLanguage) {
              const match = fetchedPrices.find(
                (e) => e.id == item.sellingPriceId,
              );
              return {
                ...item,
                name: match?.name ?? "",
                nameSecondLanguage: match?.nameSecondLanguage ?? "",
              };
            }
            return item;
          });

          const allDiscounts = [...enrichedExisting, ...missingDiscounts];
          handleUpdate(allDiscounts);
        }
      };
      fetchData();
    }
  }, [formType]);

  const handleDiscountChange = (
    sellingPriceId: string,
    field: keyof ProductSellingPriceDiscountModel,
    value: any,
  ) => {
    console.log("field:", field);
    console.log("value:", value);
    const updated = productSellingPriceDiscounts.map((item) =>
      item.sellingPriceId === sellingPriceId
        ? { ...item, [field]: value }
        : item,
    );
    handleUpdate(updated);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 1.5,
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        backgroundColor: "transparent",
        maxHeight: "500px",
        overflowX: "auto",
        overflowY: "auto",
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <TableRow>
            <TableCell
              sx={{
                lineHeight: "normal",
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "text.secondary",
                borderBottom: `1px solid ${theme.palette.divider}`,
                py: 1.5,
              }}
            >
              {handleTranslate("Name")}
            </TableCell>
            <TableCell
              align='center'
              sx={{
                lineHeight: "normal",
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "text.secondary",
                borderBottom: `1px solid ${theme.palette.divider}`,
                py: 1.5,
              }}
            >
              {handleTranslate("Discount")}
            </TableCell>
            <TableCell
              align='center'
              sx={{
                lineHeight: "normal",
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "text.secondary",
                borderBottom: `1px solid ${theme.palette.divider}`,
                py: 1.5,
              }}
            >
              {handleTranslate("DiscountType")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productSellingPriceDiscounts.map((discountItem, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                verticalAlign: "top",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell sx={{ minWidth: 200 }}>
                <InputText
                  label=''
                  value={
                    theme.direction === "rtl"
                      ? discountItem.name
                      : discountItem.nameSecondLanguage
                  }
                  disabled={true}
                  fullWidth
                />
              </TableCell>
              <TableCell sx={{ minWidth: 200 }}>
                <InputNumber
                  label=''
                  variant='outlined'
                  fullWidth
                  disabled={formType == FormTypes.Details}
                  value={discountItem.discount ?? 0}
                  inputType={
                    discountItem.discountType === DiscountType.Percent
                      ? "percent"
                      : "number"
                  }
                  onChange={(value) =>
                    handleDiscountChange(
                      discountItem.sellingPriceId,
                      "discount",
                      value,
                    )
                  }
                />
              </TableCell>
              <TableCell sx={{ minWidth: 200 }}>
                <InputSelect
                  options={DiscountTypeOptions.map((e) => ({
                    ...e,
                    label: handleTranslate(e.label),
                  }))}
                  label=''
                  disabled={formType == FormTypes.Details}
                  defaultValue={discountItem.discountType}
                  onChange={({ target }: { target: { value: DiscountType } }) =>
                    handleDiscountChange(
                      discountItem.sellingPriceId,
                      "discountType",
                      target.value,
                    )
                  }
                  name='DiscountType'
                  onBlur={null}
                  error={undefined}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductSellingPriceDiscountsInput;
