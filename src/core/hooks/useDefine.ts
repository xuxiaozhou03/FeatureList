import { useEffect, useState } from "react";

const useDefine = () => {
  const [str, setStr] = useState<string>("");
  useEffect(() => {
    fetch("/define.text")
      .then((res) => res.text())
      .then((text) => {
        setStr(text);
      });
  }, []);

  return { str };
};

export default useDefine;
