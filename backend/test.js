let array = [1, 2, 3, 4, 5];

let obj = {
  name: "he",
  newArr: array.map((item) => {
    if (item === 3) {
      return 8;
    } else {
      return item;
    }
  }),
};
console.log(obj.newArr);
// console.log(he);
