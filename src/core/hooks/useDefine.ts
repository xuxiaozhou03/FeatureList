import { useEffect, useState } from "react";

const useDefine = () => {
  const [str, setStr] = useState<string>("");
  useEffect(() => {
    fetch(
      import.meta.env.MODE === "production"
        ? location.href + "/define.text"
        : "/define.text"
    )
      .then((res) => res.text())
      .then((text) => {
        setStr(text);
      });
  }, []);

  return { str };
};

export default useDefine;
