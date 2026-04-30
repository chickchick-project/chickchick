type TColors = {
  primary: { [key: string]: string };
  gray: { [key: string]: string };
  white: string;
};

export type TBgColor = keyof TColors;

export const BACKGROUND_COLORS: TColors = {
  primary: {
    "100": "bg-primary-100",
    "200": "bg-primary-200",
    "300": "bg-primary-300",
    "400": "bg-primary-400",
    "500": "bg-primary-500",
    "600": "bg-primary-600",
  },
  gray: {
    "100": "bg-gray-100",
    "200": "bg-gray-200",
    "300": "bg-gray-300",
  },
  white: "bg-white",
};
