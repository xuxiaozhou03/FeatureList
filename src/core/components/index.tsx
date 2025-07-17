import { useState } from "react";
import FeatureListLayout from "./FeatureListLayout";
import PreviewDefine from "./PreviewDefine";
import VersionList from "./VersionList";

export default function FeatureListPage() {
  const [menu, setMenu] = useState("versionList");

  // 菜单项定义
  const menuItems = [
    { key: "versionList", label: "版本列表" },
    { key: "previewDefine", label: "预览功能清单定义" },
  ];

  return (
    <FeatureListLayout menu={menu} setMenu={setMenu} menuItems={menuItems}>
      {menu === "versionList" && <VersionList />}
      {menu === "previewDefine" && <PreviewDefine />}
    </FeatureListLayout>
  );
}
