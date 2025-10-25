export const sum = (array: number[] | undefined): number => {
  let sum = 0;
  array?.forEach((num) => {
    sum += num;
  });
  return sum;
};
