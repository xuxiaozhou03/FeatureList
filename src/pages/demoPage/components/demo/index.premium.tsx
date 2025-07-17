import React, { useState } from "react";

const DemoPremium: React.FC = () => {
  const [text, setText] = useState("");
  return (
    <div className="text-yellow-600 font-bold">
      高级版专属功能：
      <input
        className="ml-2 px-2 py-1 border rounded text-black"
        placeholder="输入内容"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span className="ml-2">你输入了：{text}</span>
    </div>
  );
};

export default DemoPremium;
