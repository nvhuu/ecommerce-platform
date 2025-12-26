export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  NUMBER = 'number',
  TEL = 'tel',
  URL = 'url',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: FieldOption[];
  defaultValue?: string;
}
