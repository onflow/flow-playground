import styled from 'styled-components';
import { WhiteOverlay } from 'components/Common';
import { motion } from 'framer-motion';
import React from 'react';
import { Text, useThemeUI } from 'theme-ui';
import Button from 'components/Button';
import OpenProjectButton from 'components/ActionButton';
import Mixpanel from 'util/mixpanel';
import ExplorerPlusIcon from './Icons/ExplorerPlusIcon';
import { SXStyles, ThemedComponentProps } from 'src/types';

const Examples: React.FC<{
  visible: boolean;
  triggerClose?: () => void;
}> = ({ visible, triggerClose }) => {
  const context = useThemeUI();
  const { theme } = context;

  const examples = [
    {
      title: ' First Steps',
      subtitle:
        'Learn how to use smart contracts, switch accounts, and view account state.',
      emoji: '🏃',
      docsLink: 'https://cadence-lang.org/docs/tutorial/first-steps',
    },
    {
      title: 'Hello, World!',
      subtitle:
        'Write your first contract on Flow. This is the perfect place to start to get the hang of the fundamentals of Cadence.',
      emoji: '🌎',
      projectLink: 'https://play.flow.com/1c0f3c76-e70f-4c25-8d45-d6493a652f80',
      docsLink: 'https://cadence-lang.org/docs/tutorial/hello-world',
    },
    {
      title: 'Mint Fungible Tokens',
      subtitle:
        'Create and sell digital assets of your own in this tutorial! This tutorial will teach you the basics of creating, storing, and moving digital assets and tokens.',
      emoji: '💸',
      projectLink: 'https://play.flow.com/765c14c7-8097-4a0f-9bf3-73472fb6d0bc',
      docsLink: 'https://cadence-lang.org/docs/tutorial/fungible-tokens',
    },
    {
      title: 'Create Non-Fungible Tokens',
      subtitle:
        'Create and shape your own unique digital objects. Here you’ll learn what really makes blockchains magic - the ability for unique items to be created, shared, and stored forever.',
      emoji: '😺',
      projectLink: 'https://play.flow.com/768bf0ef-24fe-46a5-b224-c09382eeae97',
      docsLink: 'https://cadence-lang.org/docs/tutorial/non-fungible-tokens-1',
    },
    {
      title: 'Build a Marketplace',
      subtitle:
        'Put it all together in a marketplace! This tutorial will teach you how to turn all the concepts you’ve learned into a place for people to share their creations with the community.',
      emoji: '🤝',
      projectLink: 'https://play.flow.com/6f68e782-b6c9-47d4-9389-f6f58b6c7678',
      docsLink: 'https://cadence-lang.org/docs/tutorial/marketplace-compose',
    },
    {
      title: 'Expand Non-Fungible Tokens',
      subtitle:
        'This tutorial is for the brave and the bold, an opportunity to discover what resources make possible - resources owning other resources. If you can imagine it, you can create it.',
      emoji: '🤠',
      projectLink: 'https://play.flow.com/8437c2f2-7928-406e-b6ef-c64bc534a30a',
      docsLink: 'https://cadence-lang.org/docs/tutorial/resources-compose',
    },
    {
      title: 'Voting Contract',
      subtitle:
        'With the advent of blockchain technology and smart contracts, it has become popular to try to create decentralized voting mechanisms that allow large groups of users to vote completely on chain',
      emoji: '🗳️',
      projectLink: 'https://play.flow.com/e7acb2ed-53a3-4363-89fa-feab3cab965e',
      docsLink: 'https://cadence-lang.org/docs/tutorial/voting',
    },
    // TODO: add this when contracts can be deployed without failure
    //  {
    //     title: 'Hybrid Custody Contract',
    //     subtitle:
    //       'This scaffold was created to make starting and exploring a Hybrid Custody project easier for you, and is a simplified template of the contents in @onflow/hybrid-custody. If building on these contracts, you might consider using Git Submodules to ensure your dependencies remain up to date.',
    //     emoji: '🤝',
    //     projectLink: 'https://play.flow.com/d120f0a7-d411-4243-bc59-5125a84f99b3',
    //     docsLink: 'https://developers.flow.com/concepts/hybrid-custody',
    //   },
  ];

  const ExamplesContainer = styled(motion.div)`
    position: fixed;
    display: flex;
    flex-direction: row;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    bottom: 0;
    justify-content: center;
    align-items: center;

    a {
      text-decoration: none;
      color: inherit;
      -moz-appearance: none;
      -webkit-appearance: none;
    }
  `;

  const Stack = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2rem;
    max-height: 100%;
    overflow-y: auto;
    width: 100%;
  `;

  const StackContent = styled.div`
    max-width: 1330px;
    margin: 0 auto;
  `;

  const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    & h3 {
      font-size: 1.5rem;
    }

    & svg {
      cursor: pointer;
    }
  `;

  const ExampleContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(100px, 320px));
    grid-gap: 1rem;
    a,
    .full-height {
      height: 100%;
    }
  `;

  const Buttons = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    width: 100%;

    align-items: flex-start;

    button {
      width: 100%;
    }
  `;

  const Example = styled.div<ThemedComponentProps>`
    display: grid;
    grid-template-rows: 80px auto 1fr auto;
    grid-gap: 1rem;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.07);
    transition: all 0.25s ease-in-out;
    color: ${({ theme }) => theme.colors.text};
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.background};

    &:hover {
      box-shadow: 0 0 15px 0 ${({ theme }) => theme.colors.accent};
    }

    .title {
      font-size: 22px;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 700;
      text-align: center;
      justify-content: center;
      height: 100%;
    }

    .subtitle {
      line-height: 22px;
      font-size: 15px;
      text-align: left;
      align-items: flex-start;
      height: 100%;
      padding-bottom: 0.5rem;
    }

    .emoji {
      font-size: 3rem;
      align-items: center;
      justify-content: center;
      height: 100%;
      display: flex;
    }
  `;
  const ExampleContainers = {
    visible: {
      display: 'flex',
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
      zIndex: 99,
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
      zIndex: -1,
    },
  };

  const exampleItem = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ease: [1, 0.5, 0, 0],
      },
    },
    hidden: {
      opacity: 0,
      x: 200,
      transition: {
        ease: [1, 0.5, 0, 0],
      },
    },
  };

  const styles: SXStyles = {
    closed: {
      padding: '0px',
      svg: {
        transform: 'rotate(45deg)',
      },
    },
  };

  return (
    <ExamplesContainer
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={ExampleContainers}
    >
      <WhiteOverlay onClick={triggerClose} theme={theme} />
      <Stack>
        <StackContent>
          <Header>
            <h3>Playground Tutorials</h3>
            <Button
              inline={true}
              sx={styles.closed}
              variant="explorer"
              onClick={triggerClose}
            >
              <ExplorerPlusIcon />
            </Button>
          </Header>
          <ExampleContainer>
            {examples.map((_example: any, index: number) => {
              return (
                <motion.div
                  variants={exampleItem}
                  key={index}
                  className="full-height"
                >
                  <Example theme={theme}>
                    <Text className="emoji">{_example.emoji}</Text>
                    <Text className="title">{_example.title}</Text>
                    <Text className="subtitle">{_example.subtitle}</Text>
                    <Buttons>
                      <a
                        title={`Go to documentation for "${_example.title}"`}
                        href={_example.docsLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => {
                          Mixpanel.track('Redirect to project documentation', {
                            link: _example.docsLink,
                            title: _example.title,
                          });
                        }}
                      >
                        <OpenProjectButton variant="secondary">
                          Read More
                        </OpenProjectButton>
                      </a>
                      {_example.projectLink && (
                        <a
                          title={`Open "${_example.title}" project in Playground`}
                          href={_example.projectLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            Mixpanel.track('Open example project', {
                              link: _example.projectLink,
                              title: _example.title,
                            });
                          }}
                        >
                          <OpenProjectButton>Open Project</OpenProjectButton>
                        </a>
                      )}
                    </Buttons>
                  </Example>
                </motion.div>
              );
            })}
          </ExampleContainer>
        </StackContent>
      </Stack>
    </ExamplesContainer>
  );
};

export default Examples;
