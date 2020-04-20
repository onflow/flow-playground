export const animations = {
  editor: {
    default: {
      height: "100%",
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "afterChildren"
      }
    },
    saveTemplate: {
      opacity: 0,
      transition: {
        when: "beforeChildren"
      }
    }
  },
  contracts: {
    default: {
      opacity: 0,
      zIndex: -1,
      paddingTop: "1rem",
      marginTop: "-1rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      transition: {
        when: "afterChildren",
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    },
    saveTemplate: {
      height: "100%",
      opacity: 1,
      zIndex: 2,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  },
  templateItem: {
    default: {
      opacity: 0,
      y: 200,
      transition: {
        duration: 0.1,
        ease: [1, 0.8, 0, 0]
      }
    },
    saveTemplate: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [1, 0.5, 0, 0]
      }
    }
  }
};
