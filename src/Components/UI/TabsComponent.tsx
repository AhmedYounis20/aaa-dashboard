import { Box, Tab as MuiTab, Tabs as MuiTabs, useTheme } from "@mui/material";
import React, { useState } from "react";

interface TabItem {
  label: string;
  isActive: boolean;
  icon: React.ReactElement;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: TabItem[];
  defaultTab?: number;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  tabs,
  defaultTab = 0,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 0.125rem 0.25rem ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          overflow: "hidden",
        }}
      >
        <MuiTabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label='product tabs'
          variant='scrollable'
          scrollButtons='auto'
          sx={{
            minHeight: "45px",
            "& .MuiTabs-indicator": {
              height: "3px",
              backgroundColor: theme.palette.primary.main,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: "45px",
              flexGrow: 1,
              maxWidth: "none",
              minWidth: "120px",
              fontWeight: 600,
              fontSize: ".875rem",
              color: theme.palette.text.secondary,
              borderRight: `1px solid ${theme.palette.divider}`,
              "&.Mui-selected": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default,
              },
              "&:last-child": {
                borderRight: "none",
              },
            },
          }}
        >
          {tabs
            .filter((tab) => tab.isActive)
            .map((tab, index) => (
              <MuiTab
                key={index}
                icon={tab.icon}
                iconPosition='start'
                label={tab.label}
                id={`product-tab-${index}`}
                aria-controls={`product-tabpanel-${index}`}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                }}
              />
            ))}
        </MuiTabs>
      </Box>
      <Box
        sx={{
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "0 0 12px",
        }}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            role='tabpanel'
            hidden={activeTab !== index}
            id={`product-tabpanel-${index}`}
            aria-labelledby={`product-tab-${index}`}
          >
            {activeTab === index && <Box>{tab.content}</Box>}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default TabsComponent;
