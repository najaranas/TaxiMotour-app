declare module "react-native-indicators" {
  import { ComponentType } from "react";

  interface IndicatorProps {
    color?: string;
    size?: number;
    count?: number;
    animationDuration?: number;
  }

  export const BallIndicator: ComponentType<IndicatorProps>;
  export const MaterialIndicator: ComponentType<IndicatorProps>;
  export const PulseIndicator: ComponentType<IndicatorProps>;
  export const DotIndicator: ComponentType<IndicatorProps>;
  export const WaveIndicator: ComponentType<IndicatorProps>;
  export const BarIndicator: ComponentType<IndicatorProps>;
  export const PacmanIndicator: ComponentType<IndicatorProps>;
  export const SkypeIndicator: ComponentType<IndicatorProps>;
  export const UIActivityIndicator: ComponentType<IndicatorProps>;
}
