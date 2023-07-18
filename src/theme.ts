export default {
  breakpoints: ['576px', '768px', '992px'],
  isMobile: window.matchMedia('(max-width: 768px)')?.matches,
  colors: {
    primary: '#ffffff',
    secondary: '#2F353F',
    secondaryBackground: '#ffffff',
    accent: '#C7E0FF',
    active: '#3031D1',
    background: '#F6F7F9',
    text: '#2F353F',
    muted: '#6a6a6a',
    grey: '#DDDDDD',
    icons: '#69717E',
    purple: '#f694ff',
    border: '#F0F0F0',
    outline: '#DEE2E9',
    shadow: '#c9c9c9',
    errors: '#FC4723',
    errorBackground: '#FFEAE9',
    warning: '#ffcc00',
    info: '#55EE1E26',
    infoBackground: '#55EE1E',
    error: '#f44336',
    errorToast: '#fc4723',
    focus: '#0000ff',
    heading: '#919191',
    badgeResource: '#0093AF',
    badgeCapability: '#3DDC84',
    badgeNull: '#8C92AC',
    // TODO: Consolidate color names after we import more v2 colors
    actionBlue: '#1E1FB9',
    leftSidebarBackground: '#DEE2E9',
    leftSidebarHeaderText: '#69717E',
    alternateButtonBorder: '#DEE2E9',
    alternateButtonBackground: '#DEE2E9',
    blueBorder: '#3B3CFF',
    disabledButtonText: '#F6F7F9',
    secondaryButtonBorder: '#000000',
    disabledButtonBackground: '#BDBDBD',
    avatarSelectedColor: '#3031D1',
    avatarNotSelectedColor: '#DEE2E9',
    avatarTextColor: '#69717E',
    borderColor: '#ABB3BF',
    buttonBorder: '#000000',
    primaryBtnBg: '#000000',
    primaryBtnBorder: '#000000',
    secondaryBtnBorder: '#000000',
    primaryBtnPressed: '#1E1FB9',
    secondaryBtnPressed: '#1E1FB9',
    primaryBtnDisabled: '#59595966',
    secondaryBtnDisabled: '#59595966',
    modes: {
      dark: {
        border: '#2F353F',
        alternateButtonBorder: '#2F353F',
        disabledButtonText: '#2F353F',
        secondaryButtonBorder: '#B795FF',
        primary: '#000000',
        secondaryBackground: '#1F3140',
        accent: '#3031D1',
        background: '#2F353F',
        text: '#FFFFFF',
        muted: '#999999',
        secondary: '#1F3140',
        icons: '#ABB3BF',
      },
    },
  },
  fonts: {
    body: 'Interstate, system-ui, sans-serif',
    heading: 'Interstate, system-ui, sans-serif',
    monospace: "Menlo, Monaco, 'Courier New', monospace",
  },
  forms: {
    subtle: {
      padding: 0,
      border: 'none',
      color: 'purple',
      marginRight: '0.5rem',
      textOverflow: 'ellipsis',
    },
  },
  buttons: {
    icon: {
      // effects all iconButtons
      stroke: 'text',
    },
    primary: {
      borderRadius: '8px',
      borderSize: '1px',
      borderColor: 'outline',
      fontFamily: 'body',
      fontWeight: 500,
      margin: 0,
      fontSize: 1,
      maxWidth: '350px',
      height: '54px',
      backgroundColor: 'secondary',
      color: 'primary',
      '&:active': {
        backgroundColor: 'focus',
      },
      '&:hover': {
        backgroundColor: 'focus',
        borderColor: 'focus',
      },
      '&:disabled': {
        backgroundColor: 'muted',
      },
    },
    secondary: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: '8px',
      backgroundColor: 'secondaryBackground',
      fontFamily: 'body',
      fontWeight: 500,
      color: 'text',
      margin: 0,
      maxWidth: '350px',
      '&:hover': {
        color: 'text',
        borderColor: 'focus',
        backgroundColor: 'accent',
      },
      '&:active': {
        color: 'text',
        borderColor: 'accent',
        backgroundColor: 'accent',
      },
      '&:disabled': {
        color: 'muted',
        backgroundColor: 'secondaryBtnDisabled',
      },
    },
    disabled: {
      border: 'none',
      borderRadius: '8px',
      borderWidth: 3,
      fontFamily: 'body',
      fontWeight: 500,
      color: 'disabledButtonText',
      backgroundColor: 'disabledButtonBackground',
      margin: 0,
    },
    explorer: {
      border: 'none',
      background: 'unset',
      fontFamily: 'body',
      color: 'text',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      fontWeight: 500,
      borderRadius: '4px',
      fontSize: 4,
      backgroundColor: 'unset',
      padding: '8px 12px',
      '&:hover': {
        backgroundColor: 'accent',
      },
      '&:active': {
        backgroundColor: 'unset',
      },
    },
    unstyled: {
      color: 'text',
      padding: '0',
      borderStyle: 'none',
      outline: 0,
      background: 'transparent',
    },
  },
  links: {
    primary: {
      fontFamily: 'body',
      color: 'text',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      fontWeight: 500,
      padding: '0.25rem ',
      borderRadius: '8px',
      fontSize: 4,
      '&:hover': {
        color: 'text',
        borderColor: 'focus',
        backgroundColor: 'accent',
      },
      '&:active': {
        color: 'text',
        borderColor: 'accent',
        backgroundColor: 'accent',
      },
      '&:disabled': {
        color: 'muted',
        backgroundColor: 'secondaryBtnDisabled',
      },
    },
    secondary: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: '8px',
      backgroundColor: 'secondaryBackground',
      fontFamily: 'body',
      fontWeight: 500,
      color: 'text',
      margin: 0,
      '&:hover': {
        color: 'text',
        borderColor: 'focus',
        backgroundColor: 'accent',
      },
      '&:active': {
        color: 'text',
        borderColor: 'focus',
        backgroundColor: 'accent',
      },
      '&:disabled': {
        color: 'muted',
        backgroundColor: 'secondaryBtnDisabled',
      },
    },
  },
  fontWeights: {
    thin: 200,
    body: 400,
    medium: 500,
    heading: 700,
    bold: 800,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  fontSizes: [
    '0.75rem',
    '0.875rem',
    '1rem',
    '1.125rem',
    '1.25rem',
    '1.5rem',
    '1.875rem',
    '2.25rem',
    '3rem',
    '3.75rem',
    '4.5rem',
    '6rem',
    '8rem',
    '12px',
    '14px',
  ],
  space: [
    '0',
    '0.125rem',
    '0.25rem',
    '0.375rem',
    '0.5rem',
    '0.625rem',
    '0.75rem',
    '0.875rem',
    '1rem',
    '1.25rem',
    '1.5rem',
    '1.75rem',
    '2rem',
    '2.25rem',
    '2.5rem',
    '2.75rem',
    '3rem',
    '3.5rem',
    '4rem',
    '5rem',
    '6rem',
    '7rem',
    '8rem',
    '9rem',
    '10rem',
    '11rem',
    '12rem',
    '13rem',
    '14rem',
    '15rem',
    '16rem',
    '18rem',
    '20rem',
    '24rem',
  ],
  radii: [4, 8, '1rem', '2rem', '4rem'],
  borderWidths: [1, 4],
  shadows: [
    '9px 9px 10px #d9c5d6, -9px -9px 10px whitesmoke',
    '5px 5px 10px #d6e3e6, -5px -5px 10px #ffffff',
    '2px 2px 5px #d6e3e6, -2px -2px 5px #ffffff',
  ],
  borders: ['2px solid rgb(240, 240, 240)'],
  boxes: {
    borderBox: {
      position: 'relative',
      background: 'background',
      overflow: 'hidden',
      borderRadius: 2,
      boxShadow: 2,
      border: 0,
      transition: 'box-shadow 0.2s',
      '&:hover': {
        boxShadow: 1,
      },
    },
  },
  text: {
    icon: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 3,
      ':hover': {
        cursor: 'pointer',
      },
      svg: {
        marginRight: '0.2rem',
      },
    },
  },
};
