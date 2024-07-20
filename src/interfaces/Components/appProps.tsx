export type appProps = {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: ((open: boolean) => void) | undefined;
};
