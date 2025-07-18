import type { IFeature } from "../type/feature";

export interface VersionItem {
  id: string;
  name: string;
  desc: string;
  features: IFeature;
  createdAt: number;
}

export interface VersionLocalItem extends Omit<VersionItem, "features"> {
  features: string;
}
