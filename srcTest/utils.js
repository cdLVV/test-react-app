let a = 1;
export const getA = () => {
  console.log("=======================");
  return a;
};

export const setA = (val) => {
  console.log("=======================setA");
  return (a = val);
};
