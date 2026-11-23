import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material";
import { appContext } from "../layout/DefaultLayout";

const theme = createTheme();

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

type ProvidersProps = {
  children: ReactNode;
  queryClient?: QueryClient;
};

export function AllProviders({ children, queryClient }: ProvidersProps) {
  const client = queryClient ?? createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <appContext.Provider
          value={{
            isMobile: false,
            isSidebarOpen: false,
            setIsSidebarOpen: () => {},
          }}
        >
          {children}
        </appContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { queryClient?: QueryClient }
) {
  const { queryClient, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => <AllProviders queryClient={queryClient}>{children}</AllProviders>,
    ...renderOptions,
  });
}
