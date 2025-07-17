/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import mockList from "./mock";
import type { VersionItem } from "../type";

const STORAGE_KEY = "featurelist_versions";

function loadVersions(): VersionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockList;
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveVersions(list: VersionItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useVersionList() {
  const [versions, setVersions] = useState<VersionItem[]>([]);

  useEffect(() => {
    setVersions(loadVersions());
  }, []);

  const addVersion = useCallback(
    (name: string, desc: string, features: any) => {
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
    (id: string, name: string, desc: string, features: any) => {
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
