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
        20: "#efefef",
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
        // blue
        100: "#E3F2FD",
        200: "#BBDEFB",
        300: "#90CAF9",
        400: "#64B5F6",
        500: "#2E90FA", // manually adjusted
        600: "#1C7ED6",
        700: "#1864AB",
        800: "#104E8B",
        900: "#0B3A66",
    },
    secondary: {
        // yellow
        50: "#f0f0f0", // manually adjusted
        100: "#fff6e0",
        200: "#ffedc2",
        300: "#ffe3a3",
        400: "#ffda85",
        500: "#ffd166",
        600: "#cca752",
        700: "#997d3d",
        800: "#665429",
        900: "#332a14",
    },
    dark: {
        // dark grey
        10: "#181818ed",
        50: "#e2e2e2", // manually adjusted
        100: "#c9c9c9",
        200: "#b0b0b0",
        300: "#969696",
        400: "#7d7d7d",
        500: "#636363",
        600: "#4a4a4a",
        700: "#313131",
        800: "#181818",
        900: "#000000", // manually adjusted
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
                        ...tokensDark.dark,
                        main: tokensDark.dark[900],
                        light: tokensDark.dark[700],
                    },
                    secondary: {
                        ...tokensDark.dark,
                        main: tokensDark.dark[300],
                    },
                    neutral: {
                        ...tokensDark.dark,
                        main: tokensDark.dark[500],
                    },
                    background: {
                        default: tokensDark.dark[900],
                        paper: tokensDark.dark[800],
                    },
                }
                : {
                    // palette values for light mode
                    primary: {
                        ...tokensLight.primary,
                        main: tokensDark.primary[500],
                        light: tokensDark.primary[100],
                    },
                    secondary: {
                        ...tokensLight.secondary,
                        main: tokensDark.secondary[600],
                        light: tokensDark.secondary[700],
                    },
                    neutral: {
                        ...tokensLight.grey,
                        main: tokensDark.grey[500],
                    },
                    background: {
                        default: tokensDark.grey[10],
                        paper: tokensDark.grey[0],
                    },
                }),
        },
        typography: {
            fontFamily: direction === "rtl" ? `"Cairo", sans-serif` : `"open-sans", sans-serif`,
            fontSize: 12,
            h1: {
                fontFamily: direction === "rtl" ? `"Cairo", sans-serif` : `"open-sans", sans-serif`,
                fontSize: 40,
            },
            h2: {
                fontFamily: direction === "rtl" ? `"Cairo", sans-serif` : `"open-sans", sans-serif`,
                fontSize: 32,
            },
            h3: {
                fontFamily: direction === "rtl" ? `"Cairo", sans-serif` : `"open-sans", sans-serif`,
                fontSize: 24,
            },
            h4: {
                fontFamily: direction === "rtl" ? `"Cairo", sans-serif` : `"open-sans", sans-serif`,
                fontSize: 20,
            },
            h5: {
                fontFamily: direction === "rtl" ? `"Cairo", sans-serif` : `"open-sans", sans-serif`,
                fontSize: 16,
            },
            h6: {
                fontFamily: direction === "rtl" ? `"Cairo", sans-serif` : `"open-sans", sans-serif`,
                fontSize: 14,
            },
        },
    };
};
