export default {
  colors: {
    primary: "#00ff76",
    darkPrimary: "#2bb169",
    background: "#fff",
    text: "#222",
    muted: "#6a6a6a",
    grey: "#DDDDDD",
    darkGrey: "#909090",
    greyBorder: "#D8D8D8",
    purple: "#f694ff",
    border: "rgb(240, 240, 240)",
    borderDark: "rgb(222, 222, 222)",
    shadowColor: "rgb(222, 222, 222)",
    warning: "#ffcc00",
    error: "#f44336",
    blue: "#0000ff",
    heading: "#919191",
    badgeResource: "#0093AF",
    badgeCapability: "#3DDC84",
    badgeStruct: "#FA8C28",
    badgeNull: "#8C92AC",
  },
  fonts: {
    body: "Interstate, system-ui, sans-serif",
    heading: "Interstate, system-ui, sans-serif",
    monospace: "Menlo, Monaco, 'Courier New', monospace"
  },
  forms: {
    subtle: {
      padding: 0,
      border: "none",
      color: "purple",
      marginRight: "0.5rem",
      textOverflow: "ellipsis"
    }
  },
  buttons: {
    primary: {
      border: "none",
      borderRadius: "8px",
      backgroundColor: "primary",
      fontFamily: "body",
      fontWeight: 500,
      color: "text",
      margin: 0,
      paddingX: "1rem",
      paddingY: "0.75rem",
      fontSize: 4,
      "&:active": {
        backgroundColor: "#10EF77",
      },
    },
    disabled: {
      border: "none",
      backgroundColor: "grey",
      borderRadius: "8px",
      borderWidth: 3,
      fontFamily: "body",
      fontWeight: 500,
      color: "text",
      margin: 0,
      paddingX: "1rem",
      paddingY: "0.75rem",
      fontSize: 4
    },
    secondary: {
      border: "none",
      background: "none",
      fontFamily: "body",
      color: "text",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      margin: 0,
      fontWeight: 500,
      paddingX: "0.65rem",
      paddingY: "0.5rem",
      borderRadius: "5px",
      "&:hover": {
        background: "rgb(245, 245, 245)",
      }
    }
  },
  fontWeights: {
    thin: 200,
    body: 400,
    medium: 500,
    heading: 700,
    bold: 800
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  fontSizes: ["1rem", "2rem", "4rem", 12, 14, 16, 20, 24, 32, 48, 64, 72],
  space: [0, "1rem", "2rem", "4rem"],
  radii: [4, 8, "1rem", "2rem", "4rem"],
  borderWidths: [1, 4],
  shadows: [
    "9px 9px 10px #d9c5d6, -9px -9px 10px whitesmoke",
    "5px 5px 10px #d6e3e6, -5px -5px 10px #ffffff",
    "2px 2px 5px #d6e3e6, -2px -2px 5px #ffffff"
  ],
  borders: ["2px solid rgb(240, 240, 240)"],
  boxes: {
    borderBox: {
      position: "relative",
      background: "white",
      overflow: "hidden",
      borderRadius: 2,
      boxShadow: 2,
      border: 0,
      transition: "box-shadow 0.2s",
      "&:hover": {
        boxShadow: 1
      }
    }
  },
  text: {
    icon: {
      display: "flex",
      alignItems: "center",
      fontSize: 3,
      ":hover": {
        cursor: "pointer"
      },
      svg: {
        marginRight: "0.2rem"
      }
    }
  }
};
