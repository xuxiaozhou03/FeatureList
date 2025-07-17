import type { IFeature } from "../type/feature";

export interface VersionItem {
  id: string;
  name: string;
  desc: string;
  features: IFeature;
  createdAt: number;
}
