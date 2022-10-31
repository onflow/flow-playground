import React from "react";
import { SXStyles } from "src/types";
import { Button, Flex } from "theme-ui";

const styles: SXStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px', 
  }
}


const FileExplorerSubMenu = () => {
  return (
    <Flex sx={styles.root}>
      <Button>
        Edit name
      </Button>
      <Button>
        Delete
      </Button>
    </Flex>
  )
}

export default FileExplorerSubMenu;