import { PaletteMode, ThemeOptions } from "@mui/material";

type ColorTokens = {
    [key: string]: {
        [shade: string]: string;
    };
};

export const tokensDark: ColorTokens = {
    grey: {
        0: "#ffffff", // manually adjusted
        10: "#f6f6f6", // manually adjusted
        50: "#f0f0f0", // manually adjusted
        100: "#e0e0e0",
        200: "#c2c2c2",
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414",
        1000: "#000000", // manually adjusted
    },
    primary: {
        // Modern blue palette
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
    },
    secondary: {
        // Modern teal palette
        50: "#f0fdfa",
        100: "#ccfbf1",
        200: "#99f6e4",
        300: "#5eead4",
        400: "#2dd4bf",
        500: "#14b8a6",
        600: "#0d9488",
        700: "#0f766e",
        800: "#115e59",
        900: "#134e4a",
    },
    accent: {
        // Modern purple palette
        50: "#faf5ff",
        100: "#f3e8ff",
        200: "#e9d5ff",
        300: "#d8b4fe",
        400: "#c084fc",
        500: "#a855f7",
        600: "#9333ea",
        700: "#7c3aed",
        800: "#6b21a8",
        900: "#581c87",
    },
    success: {
        main: "#10b981",
        light: "#34d399",
        dark: "#059669",
    },
    warning: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#d97706",
    },
    error: {
        main: "#ef4444",
        light: "#f87171",
        dark: "#dc2626",
    },
    info: {
        main: "#3b82f6",
        light: "#60a5fa",
        dark: "#2563eb",
    },
};

// function that reverses the color palette
function reverseTokens(tokensDark: ColorTokens): ColorTokens {
    const reversedTokens: ColorTokens = {};
    Object.entries(tokensDark).forEach(([key, val]) => {
        const keys = Object.keys(val);
        const values = Object.values(val);
        const length = keys.length;
        const reversedObj: {[shade: string]: string} = {};
        for (let i = 0; i < length; i++) {
            reversedObj[keys[i]] = values[length - i - 1];
        }
        reversedTokens[key] = reversedObj;
    });
    return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (
  mode: PaletteMode,
  direction: "ltr" | "rtl"
): ThemeOptions => {
  return {
    direction,
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500],
              light: tokensDark.primary[400],
              dark: tokensDark.primary[600],
              contrastText: "#ffffff",
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[500],
              light: tokensDark.secondary[400],
              dark: tokensDark.secondary[600],
              contrastText: "#ffffff",
            },
            accent: {
              ...tokensDark.accent,
              main: tokensDark.accent[500],
              light: tokensDark.accent[400],
              dark: tokensDark.accent[600],
            },
            success: tokensDark.success,
            warning: tokensDark.warning,
            error: tokensDark.error,
            info: tokensDark.info,
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[900],
              paper: tokensDark.grey[800],
            },
            text: {
              primary: tokensDark.grey[100],
              secondary: tokensDark.grey[300],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.primary[600],
              light: tokensDark.primary[400],
              dark: tokensDark.primary[800],
              contrastText: "#ffffff",
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[400],
              dark: tokensDark.secondary[800],
              contrastText: "#ffffff",
            },
            accent: {
              ...tokensLight.accent,
              main: tokensDark.accent[600],
              light: tokensDark.accent[400],
              dark: tokensDark.accent[800],
            },
            success: tokensDark.success,
            warning: tokensDark.warning,
            error: tokensDark.error,
            info: tokensDark.info,
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              paper: "#ffffff",
            },
            text: {
              primary: tokensDark.grey[900],
              secondary: tokensDark.grey[600],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: 14,
        lineHeight: 1.6,
      },
      body2: {
        fontSize: 13,
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
  };
};

