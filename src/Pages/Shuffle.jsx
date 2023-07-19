export default function shuffle(n){

  let arr = Array.from({length: n}, (_, i) => i + 1)

  for(let i = 0; i < arr.length; i++){
    let randomGenIndex = Math.floor(Math.random() * n);

    let temp = arr[i];
    arr[i] = arr[randomGenIndex];
    arr[randomGenIndex] = temp;
  }

  return arr;
}