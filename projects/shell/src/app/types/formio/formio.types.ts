export interface FormioFormChangeEvent {
  changed: boolean | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: object;
  flags: FormioFormChangeEventFlags;
  isModified: boolean | undefined;
  isValid: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  metadata?: object;
}

export interface FormioFormChangeEventFlags {
  // eslint-disable-next-line @typescript-eslint/ban-types
  changed: object | undefined;
  changes: undefined | [];
  noValidate?: boolean;
  resetValue?: boolean;
}

export interface FormioFormBuilderEvent {
  type: 'addComponent' | 'updateComponent' | 'saveComponent' | 'deleteComponent';
  builder: unknown;
  form: unknown;
  component: unknown;
  originalComponennt?: unknown;
  parent: unknown;
}

export interface FormioFormBuilderOptions {
  language?: string;
  i18n?: {
    [key: string]: { [key: string]: string };
  };
  builder?:
    | {
        premium?: boolean; // hide premium components
        advanced?: boolean; // hide advanced components
        data?: boolean; // hide data components
        basic?: boolean; // hide basic components
      }
    | { [key: string]: FormioFormBuilderCategoryOptions };
  editForm?: {
    [key: string]: FormioFormBuilderTabOptions[];
  };
}

export type FormioFormBuilderCategoryOptions = {
  title?: string;
  default?: boolean;
  weight?: number;
  components?: {
    [key: string]: boolean;
  };
};

export type FormioFormBuilderVisibilityOptions = {
  key: string;
  ignore?: boolean;
};

export type FormioFormBuilderTabOptions =
  | FormioFormBuilderVisibilityOptions
  | {
      label?: string;
      components?: FormioFormBuilderVisibilityOptions[];
    };
