declare namespace HomePageModuleScssNamespace {
  export interface IHomePageModuleScss {
    dataTypes: string;
    exportFormats: string;
    fade: string;
    fadeIn: string;
    features: string;
    hero: string;
    heroActions: string;
    homepage: string;
    logo: string;
    quickStart: string;
    selected: string;
    stepNumber: string;
    stepWrapper: string;
    tile: string;
  }
}

declare const HomePageModuleScssModule: HomePageModuleScssNamespace.IHomePageModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HomePageModuleScssNamespace.IHomePageModuleScss;
};

export = HomePageModuleScssModule;
