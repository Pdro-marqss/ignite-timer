import styled, { css } from "styled-components";

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

interface ButtonContainerProps {
  variant: ButtonVariant;
}

const buttonVariants = {
  primary: 'purple',
  secondary: 'orange',
  success: 'green',
  danger: 'red'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  background-color: ${(props) => props.theme["green-500"]};
  color: ${props => props.theme.white};

   /* ${({ variant }) => css`background-color: ${buttonVariants[variant]}`} */
`