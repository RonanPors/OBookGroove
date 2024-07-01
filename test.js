const claimsTokenVerify = (claim1, claim2) => JSON.stringify(claim1) === JSON.stringify(claim2);

const obj1 = { a: 1, b: { c: 3 } };
const obj2 = { a: 1, b: { c: 3 } };

console.log(claimsTokenVerify(obj1, obj2));
