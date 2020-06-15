const calculateTip = (total,tipPercent = .25) =>{
  const tip = total *  tipPercent
  return total + tip
}

const fahrenheitToCelcius = (temp)=>{
  return (temp -32)/1.8
}

const celciusToFahrenhiet = (temp) =>{
   return (temp*1.8)+32
}

const addNumbers = (a,b) => {
  return new Promise((resolve, reject)=>{
    setTimeout(() => {
      if(a<0 || b<0){
        reject('math.js.addNumbers.error: non-negative numbers only')
      }
      resolve(a+b)
    }, 2000);
  })
}

module.exports = {
    calculateTip,
    fahrenheitToCelcius,
    celciusToFahrenhiet,
    addNumbers
}