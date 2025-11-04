interface IPCFieldInfo {
  field: string;
  code: string;
}

export const getIPCField = (ipcCode: string): IPCFieldInfo => {
  if (!ipcCode) return { field: "기타", code: "" };

  const firstChar = ipcCode.charAt(0).toUpperCase();
  const fieldMap: { [key: string]: string } = {
    A: "생활필수품",
    B: "처리조작/운수",
    C: "화학/야금",
    D: "섬유/지류",
    E: "고정구조물",
    F: "기계공학",
    G: "물리학",
    H: "전기",
  };

  return {
    field: fieldMap[firstChar] || "기타",
    code: ipcCode,
  };
};
