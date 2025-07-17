import React from "react";

interface MenuItem {
  key: string;
  label: string;
}

interface FeatureListLayoutProps {
  menu: string;
  setMenu: (key: string) => void;
  menuItems: MenuItem[];
  children: React.ReactNode;
}

const FeatureListLayout: React.FC<FeatureListLayoutProps> = ({
  menu,
  setMenu,
  menuItems,
  children,
}) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 min-h-0 flex">
        {/* 左侧菜单栏 */}
        <div className="w-48 bg-white border-r flex flex-col py-6 px-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`text-left px-4 py-2 rounded mb-2 font-medium transition-colors ${
                menu === item.key
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setMenu(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* 右侧内容区 */}
        <div className="flex-1 p-6 min-h-0 flex flex-col overflow-auto box-border">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FeatureListLayout;
