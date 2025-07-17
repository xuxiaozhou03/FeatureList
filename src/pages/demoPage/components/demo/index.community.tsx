import React, { useState } from "react";

const DemoCommunity: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="text-blue-600 font-bold">
      社区版专属功能：
      <button
        className="ml-2 px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
        onClick={() => setCount(count + 1)}
      >
        点我计数：{count}
      </button>
    </div>
  );
};

export default DemoCommunity;
