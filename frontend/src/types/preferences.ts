export const ViewModes = ["grid", "list", "large-grid"] as const;
export type ViewMode = (typeof ViewModes)[number];

export interface UserPreferences {
  zoomLevel?: number; // percentage of the editor zoom level (see figma)
  viewMode?: ViewMode;
}
