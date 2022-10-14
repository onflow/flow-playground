import { navigate, RouteComponentProps } from '@reach/router';
import React from 'react';
import { Box, Button, Text } from 'theme-ui';

interface ProjectProps extends RouteComponentProps {
  '*'?: string;
}

const FourOhFour: React.FC<ProjectProps> = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background',
      }}
    >
      <Text
        sx={{
          fontSize: '3rem',
          fontWeight: 'heading',
          textAlign: 'center',
        }}
      >
        Floh No! We couldn&apos;t find that project.
      </Text>
      <Text
        sx={{
          fontSize: '1rem',
          textAlign: 'center',
          padding: 1,
          width: '50%',
        }}
      >
        (If you were expecting a project here, you may be experiencing a 🐛.
        Please clear your browser&apos;s cookies and browser cache. This is a
        known issue. Thanks for your patience! 🙏)
      </Text>
      <Button
        sx={{
          marginTop: '2rem',
        }}
        onClick={() => navigate('/')}
      >
        Go back to the Playground
      </Button>
    </Box>
  );
};

export default FourOhFour;
