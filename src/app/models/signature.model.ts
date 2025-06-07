export interface Signature {
  id: string;
  type: 'image' | 'svg';
  content: File | string;
  preview: string;
}

export enum SignaturePosition {
  TOP_LEFT = 'top-left',
  TOP_CENTER = 'top-center',
  TOP_RIGHT = 'top-right',
  MIDDLE_LEFT = 'middle-left',
  MIDDLE_CENTER = 'middle-center',
  MIDDLE_RIGHT = 'middle-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_RIGHT = 'bottom-right'
}
