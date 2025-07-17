import React, { useState } from "react";

const Demo: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="text-green-600 font-bold">
      企业版/其它专属功能：
      <button
        className="ml-2 px-2 py-1 bg-green-100 rounded hover:bg-green-200"
        onClick={() => setShow((s) => !s)}
      >
        {show ? "隐藏信息" : "显示信息"}
      </button>
      {show && (
        <div className="mt-2 text-green-800">
          企业级服务与支持，助力业务成长！
        </div>
      )}
    </div>
  );
};

export default Demo;
