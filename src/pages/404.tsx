import React from "react";
import { Box, Text, Button } from "theme-ui";
import { RouteComponentProps, navigate } from "@reach/router";

interface ProjectProps extends RouteComponentProps {
  "*"?: string;
}

const FourOhFour: React.FC<ProjectProps> = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background"
      }}
    >
      <Text
        sx={{
          fontSize: "3rem",
          fontWeight: "heading",
          textAlign: "center"
        }}
      >
        Floh No! We couldn't find that project.
      </Text>
      <Button
        sx={{
          marginTop: "2rem"
        }}
        onClick={() => navigate("/")}
      >
        Go back to the Playground
      </Button>
    </Box>
  );
};

export default FourOhFour;
