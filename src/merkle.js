// npm i merkletreejs
// npm i crypto-js
// npm i merkle

const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')



const testSet = ['a','b','c'].map(v => SHA256(v))
const tree = new MerkleTree(testSet,SHA256) //두가지 인자값 하나는 내가 암호화한 배열의값 두번째는 암호화할것


const root = tree.getRoot().toString('hex')

const testRoot = 'a'
const leaf = SHA256(testRoot)
const proof = tree.getProof(leaf)
console.log( tree.verify(proof,leaf,root) )

console.log( tree.toString() )

