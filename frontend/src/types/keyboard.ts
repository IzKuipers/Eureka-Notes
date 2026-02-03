export interface KeyboardAccelerator {
  alt?: boolean;
  shift?: boolean;
  ctrl?: boolean;
  key?: string;
  action: (e: KeyboardEvent) => void;
  description?: string;
  display?: string;
}
