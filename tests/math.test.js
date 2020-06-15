const {calculateTip,fahrenheitToCelcius,celciusToFahrenhiet,addNumbers} = require('../src/math')

test('Should calculate the tip', ()=>{
    const total = calculateTip(10, .3)
    //Jest assertions
    expect(total).toBe(13)
    // if(total!==13){
    //     throw new Error('Incorrect tip calculated')
    // }
})

test('Should convert 32 F to 0 C',()=>{
    const temp = fahrenheitToCelcius(32)
    expect(temp).toBe(0)
})

test('Should convert 0 C to 32 F',()=>{
    const temp = celciusToFahrenhiet(0)
    expect(temp).toBe(32)
})

test('Add two numbers with then/catch', (next)=>{
   addNumbers(2,3).then((sum)=>{
       expect(sum).toBe(5)
       next()
   })
})

test('Add two numbers with async/await', async ()=>{
    const sum = await addNumbers(2,7)
    expect(sum).toBe(9)
})

