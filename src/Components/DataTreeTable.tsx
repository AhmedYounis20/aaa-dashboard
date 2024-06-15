import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowDown,EditNote,Info,Delete } from "@mui/icons-material";

interface Data {
  code: string;
  accountGuidId: string;
  name: string;
  nameSecondLanguage: string;
  id: string;
  children?: Data[];
}

interface TreeTableProps {
  columns: { Header: string; accessor: keyof Data }[];
  data: Data[];
}

const DataTreeTable: React.FC<TreeTableProps> = ({ columns, data }) => {
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBackgroundColor = (depth: number) => {
    const colors = ["#f0f8ff", "#e6f7ff", "#cceeff", "#b3e6ff", "#99ddff"];
    return colors[depth % colors.length];
  };

  const handleMouseEnter = (id: string) => {
    setHoveredRow(id);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const renderRows = (rows: Data[], depth = 0) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <TableRow
          style={{
            backgroundColor:
              hoveredRow === row.id ? "#f0f0f0" : getBackgroundColor(depth),
          }}
          onMouseEnter={() => handleMouseEnter(row.id)}
          onMouseLeave={handleMouseLeave}
        >
          <TableCell style={{ paddingLeft: depth * 20 }}>
            {row.children && row.children.length > 0 && (
              <IconButton size="small" onClick={() => handleToggle(row.id)}>
                {openRows[row.id] ? (
                  <KeyboardArrowDown />
                ) : (
                  <KeyboardArrowRight />
                )}
              </IconButton>
            )}
          </TableCell>
          {columns.map((column) => (
            <TableCell key={column.accessor as string}>
              {row[column.accessor]}
            </TableCell>
          ))}
          <TableCell key="operations" style={{ color: "GrayText" }}>
            <IconButton
              size="small"
              style={{ marginInline: 2 }}
              onClick={() => handleToggle(row.id)}
            >
              <EditNote titleAccess="edit" />
            </IconButton>
            <IconButton
              size="small"
              style={{ marginInline: 2 }}
              onClick={() => handleToggle(row.id)}
            >
              <Delete titleAccess="delete" />
            </IconButton>
            <IconButton
              size="small"
              style={{ marginInline: 2 }}
              onClick={() => handleToggle(row.id)}
            >
              <Info titleAccess="Details" />
            </IconButton>{" "}
          </TableCell>
        </TableRow>
        {row.children && (
          <TableRow>
            <TableCell style={{ padding: 0 }} colSpan={columns.length + 2}>
              <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                <Table size="small">
                  <TableBody>{renderRows(row.children, depth + 1)}</TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ));
  };

  return (
    <TableContainer
      component={Paper}
      style={{ maxHeight: 500, overflow: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((column) => (
              <TableCell key={column.accessor as string}>
                {column.Header}
              </TableCell>
            ))}
            <TableCell>Operations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows(data)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTreeTable;
