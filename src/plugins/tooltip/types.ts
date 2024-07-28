export type PluginOptions = {
    componentName: string;
};

export type TooltipValue =
    | {
          text: string;
          hotkey?:
              | string
              | {
                    [key: string]: string;
                };
          delay?: number;
          offset?: [number, number];
      }
    | string;
