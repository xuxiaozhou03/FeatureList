import { useCallback, useEffect, useState } from "react";
import mockList from "./mock";
import type { VersionItem, VersionLocalItem } from "../type";
import type { IFeature } from "../../type/feature";
import { decryptEditConfig, encryptEditConfig } from "../helper";

const STORAGE_KEY = "featurelist_versions";

async function loadVersions(): Promise<VersionItem[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let originalList: VersionLocalItem[] = [];
    if (!raw) {
      originalList = mockList;
    } else {
      originalList = JSON.parse(raw) as VersionLocalItem[];
    }

    const ps = originalList.map(async (item) => {
      const features = await decryptEditConfig(item.features);
      return {
        id: item.id,
        name: item.name,
        desc: item.desc,
        features,
        createdAt: item.createdAt,
      } as VersionItem;
    });

    return await Promise.all(ps);
  } catch {
    return [];
  }
}

async function saveVersions(list: VersionItem[]) {
  const ps = list.map(async (item) => {
    const features = await encryptEditConfig(item.features);
    return {
      id: item.id,
      name: item.name,
      desc: item.desc,
      features,
      createdAt: item.createdAt,
    };
  });
  const data = await Promise.all(ps);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useVersionList() {
  const [versions, setVersions] = useState<VersionItem[]>([]);

  const onInit = async () => {
    const loaded = await loadVersions();
    setVersions(loaded);
  };

  useEffect(() => {
    onInit();
  }, []);

  const addVersion = useCallback(
    (name: string, desc: string, features: IFeature) => {
      if (!name.trim()) return;
      const newVersion: VersionItem = {
        id: Date.now().toString(),
        name: name.trim(),
        desc: desc.trim(),
        features,
        createdAt: Date.now(),
      };
      const updated = [newVersion, ...versions];
      setVersions(updated);
      saveVersions(updated);
    },
    [versions]
  );

  const updateVersion = useCallback(
    (id: string, name: string, desc: string, features: IFeature) => {
      const updated = versions.map((v) =>
        v.id === id ? { ...v, name, desc, features } : v
      );
      setVersions(updated);
      saveVersions(updated);
    },
    [versions]
  );

  const deleteVersion = useCallback(
    (id: string) => {
      const updated = versions.filter((v) => v.id !== id);
      setVersions(updated);
      saveVersions(updated);
    },
    [versions]
  );

  return {
    versions,
    addVersion,
    updateVersion,
    deleteVersion,
    setVersions,
  };
}
