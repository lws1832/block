const fs = require('fs')
const merkle = require('merkle')
const Cryptojs = require('crypto-js')


const tree = merkle("sha256").sync([])  // tree 구조로 리턴해준다
tree.root()

class BlockHeader{
    constructor(version ,index ,previousHash, time, merkleRoot){
        this.version = version
        this.index = index
        this.previousHash = previousHash // 마지막 블록 -> header -> string연결 ->sha256변환
        this.time = time //
        this.merkleRoot = merkleRoot //
    }
}
class Block {
    constructor(header,body){
        this.header = header
        this.body = body
    }
}

let Blocks = [createGenesisBlock()]


function getBlock(){
    return Blocks
}

function getLastBlock(){
    return Blocks[Blocks.length - 1]
}

function createGenesisBlock(){ //최초 블록을 생성했음
    // 1. header 만들기
    // 5개 인자값을 만들어야한다.
    const version = getVersion() //패키지json에 있는 버전 1.0.0 가져옴
    const index = 0
    const time = getCurrentTime()
    const previousHash = '0'.repeat(64)
    const body = ['블록이니?']

    const tree = merkle('sha256').sync(body)
    const root = tree.root() || '0'.repeat(64)

    const header = new BlockHeader(version,index,previousHash,time,root)
    return new Block(header,body)
}
// 1번의 제네시스 블럭이 있다면 2번 블럭에 헤더와 바디를 만들어주는 함수
function nextBlock(data){
// 헤더를 만들기 위해서 버전 인덱스 해시값 타임
    const prevBlock = getLastBlock()
    const version = getVersion()
    const index = prevBlock.header.index + 1
    const previousHash = createHash(prevBlock)
    /**
        이전 해시값
        sha256 = 버전 + 인덱스 + 해시값 + 타임스탬프 + 머클 하나로 묶어준다 문자형으로

     */
    const time = getCurrentTime()

    const merkleTree = merkle("sha256").sync(data)
    const merkleRoot = merkleTree.root() || '0'.repeat(64)

    const Header = new BlockHeader(version,index,previousHash,time,merkleRoot)
    return new Block(Header,data)
}

function createHash(block){
    const {
        version,
        index,
        previousHash,
        time,
        merkleRoot
    } = block.header
    const blockString = version+index+previousHash+time+merkleRoot
    const Hash = Cryptojs.SHA256(blockString).toString()
    return Hash
}

//block push 다음 블럭에 헤더나 바디를 만들어주는 역할을 처리하지않고 단순히 푸쉬만 하는 용도로 만들거다.
function addBlock(data){
    // new header -> new block (header,body)
    // 블록을 점검해주는 코드가 들어갈 수 있다.
    const newBlock = nextBlock(data)
    if(isVaildNewBlock(newBlock, getLastBlock())){
        Blocks.push(newBlock);
        return true;
    }
    return false;
}

//etc
// 1 타입검사 변수안에 값이 오브젝트인지 스트링인지 넘버인지 
function isVaildNewBlock(currentBlock,previousBlock){
    isVaildType(currentBlock)
    return true
}

function isVaildType(block){
    console.log(block)
}
// const block = createGenesisBlock()
// console.log(block)

function getVersion(){
    const {version} = JSON.parse(fs.readFileSync("../package.json")) //읽어오기
    return version //패키지 버전 가져오기 성공
    // console.log(package.toString("utf8"))
    // console.log(JSON.parse(package).version)
    // return JSON.parse(package).version
}

function getCurrentTime(){
    return Math.ceil( new Date().getTime()/1000)
}

// class
// {header body} 1차 목표는 제네시스 블럭을 만드는것


// const blockchain = new Block(new BlockHeader(1,2,3,4,5),['hello'])
// console.log(blockchain)

addBlock(["hello1"])
addBlock(["hello2"])
addBlock(["hello3"])

// console.log(Blocks)