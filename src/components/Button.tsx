import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { ChildProps, ChildPropsOptional } from 'src/types';
import { CSSProperties } from 'styled-components';
import { Button as ThemedButton } from 'theme-ui';

interface StyledButtonProps extends ChildProps {
  style?: CSSProperties;
  className?: string;
  onClick?: any;
  variant: string;
  disabled?: boolean;
}

const StyledButton: React.FC<StyledButtonProps> = styled(ThemedButton)`
  display: flex;
  align-items: center;
  justify-content: center;

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .icon {
    margin-left: 0.5rem;
  }

  .loading {
    animation: rotating 0.5s linear infinite;
  }

  &.violet {
    background-color: #bdc4f4;
    color: #575e89;
  }

  &.grey {
    background-color: #ededed;
    color: #696969;
  }

  &.modal {
    width: 100px;
    font-size: 16px;
    font-weight: bold;
  }

  display: flex;
  align-items: center;

  cursor: ${({ variant }) =>
    variant === 'buttons.disabled' ? 'not-allowed !important' : 'pointer'};

  &:disabled {
    cursor: not-allowed;
  }
`;

interface ButtonProps extends ChildPropsOptional {
  onClick?: any;
  className?: string;
  style?: CSSProperties;
  Icon?: any;
  isLoading?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  hideDisabledState?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  style,
  className,
  Icon,
  isLoading,
  isActive,
  disabled,
  hideDisabledState,
}) => {
  const showDisabledState = disabled && !hideDisabledState;
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <StyledButton
        style={style}
        className={className}
        onClick={onClick}
        variant={
          isActive && !showDisabledState
            ? 'buttons.primary'
            : 'buttons.disabled'
        }
        disabled={disabled}
      >
        {children}
        {isLoading ? (
          <FaSpinner className="icon loading" />
        ) : Icon ? (
          <Icon className="icon" />
        ) : null}
      </StyledButton>
    </motion.div>
  );
};

Button.defaultProps = {
  onClick: () => {},
  style: {},
  className: '',
  Icon: null,
  isLoading: false,
  isActive: true,
};

export default Button;
