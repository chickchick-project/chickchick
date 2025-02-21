import ButtonBase from "./buttonBase";
import {
  ButtonFilledGrayLFit,
  ButtonFilledGrayLFixed,
  ButtonFilledGrayLFull,
  ButtonFilledPrimaryLFit,
  ButtonFilledPrimaryLFull,
  ButtonFilledPrimarySFit,
} from "./buttonFilled";
import { ButtonOutlinedGraySFit, ButtonOutlinedPrimaryLFit, ButtonOutlinedPrimaryLFull } from "./buttonOutlined";

const Component = {
  title: "Button",
  component: ButtonBase,
};

export default Component;

// filled
export const StoryButtonFilledPrimaryLFull = () => {
  return <ButtonFilledPrimaryLFull>button</ButtonFilledPrimaryLFull>;
};

export const StoryButtonFilledPrimaryLFit = () => {
  return <ButtonFilledPrimaryLFit>button</ButtonFilledPrimaryLFit>;
};

export const StoryButtonFilledPrimarySFit = () => {
  return <ButtonFilledPrimarySFit>button</ButtonFilledPrimarySFit>;
};

export const StoryButtonFilledGrayLFull = () => {
  return <ButtonFilledGrayLFull>button</ButtonFilledGrayLFull>;
};

export const StoryButtonFilledGrayLFit = () => {
  return <ButtonFilledGrayLFit>button</ButtonFilledGrayLFit>;
};

export const StoryButtonFilledGrayLFixed = () => {
  return <ButtonFilledGrayLFixed>button</ButtonFilledGrayLFixed>;
};

// outlined
export const StoryButtonOutlinedPrimaryLFull = () => {
  return <ButtonOutlinedPrimaryLFull>button</ButtonOutlinedPrimaryLFull>;
};

export const StoryButtonOutlinedPrimaryLFit = () => {
  return <ButtonOutlinedPrimaryLFit>button</ButtonOutlinedPrimaryLFit>;
};

export const StoryButtonOutlinedGraySFit = () => {
  return <ButtonOutlinedGraySFit>button</ButtonOutlinedGraySFit>;
};
