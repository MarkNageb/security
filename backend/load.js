const express = require("express");
const ethUtil = require("ethereumjs-util");
const sigUtil = require("@metamask/eth-sig-util");
const crypto = require("crypto");
var aesjs = require("aes-js");
const Web3 = require("web3");
const abi = require("./abi");
const Moralis = require("moralis/node");
// const web3Provider = Moralis.enableWeb3();
const web3 = Moralis.enableWeb3({ privateKey: "bef01efaa9317284160e90b07ee2592e9e7cf29a17a29dd212ffdc0f76568a3a" });




//const web3 = new Web3("ws://localhost:8546");
//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json());



/* Moralis init code */
const serverUrl = "https://fte4ajr1ecuv.usemoralis.com:2053/server";
const appId = "gu2NSIijo65u7hVO1otneuNoPlw29tMQg16O3D26";
const masterKey = "1ZVPVTMy22z8olEbWG7ts2lLvblO4RNJiDuIrbuj";

Moralis.start({ serverUrl, appId, masterKey });
console.log(Moralis)
//

const port = 5000;
// SERVER ASUMMETRIC KEYS
const serverPrivateKey ='bef01efaa9317284160e90b07ee2592e9e7cf29a17a29dd212ffdc0f76568a3a'
const serverPublicKey='0x28e58c74e10d2d44776d6e75ec700657127b1980';
// CLIENT PASSWORD
const clientPassword = "markmarkmarkmark";
var clientPasswordBytes = aesjs.utils.utf8.toBytes(clientPassword);
var clientCrypter = new aesjs.ModeOfOperation.ctr(
  clientPasswordBytes,
  new aesjs.Counter(5)
);

// SERVER PASSWORD
const serverPassword = "markmarkmarkmark";
var serverPasswordBytes = aesjs.utils.utf8.toBytes(serverPassword);
var serverCrypter = new aesjs.ModeOfOperation.ctr(
    serverPasswordBytes,
  new aesjs.Counter(5)
);

var contractAddress = "0x0172cF6026fF16e2C7cBCe3208766DD844922fAd";
//var patientContract = new web3.eth.Contract(abi, contractAddress);

app.post("/add-patient", async(req, res) => {
  const data = convertFromJsonToArray(req.body.data);
  try {
    var decryptedData = decryptAndCheckSignAndCheckPassword(data);
    const encryptedData=encrypt(decryptedData)
    //web3.eth.accounts.privateKeyToAccount(serverPrivateKey ,true );
    //await patientContract.methods.storeVisitRecord(serverPublicKey,decryptedData.public_key,"nader",true).send({from:serverPublicKey})

    //await transaction.send({from:serverPublicKey})
    console.log("hena")
    //console.log(transaction)
    
  } catch (error) {
    console.log(error.message);
    console.log(error)
  }
});
app.post("/decrypt", (req, res) => {
//   const data = req.body.data;
//   console.log("DATA");
//   console.log(data);
//   console.log("--------------");
//   const decrypted = crypto.privateDecrypt(serverPrivateKey, data);
//   console.log(decrypted);
});
app.post("/add_record/:encrption_key&:owner&:data", (req, res) => {
  const encryptedMessage = ethUtil.bufferToHex(
    Buffer.from(
      JSON.stringify(
        sigUtil.encrypt({
          publicKey: req.params["encrption_key"],
          data: req.params["data"],
          version: "x25519-xsalsa20-poly1305",
        })
      ),
      "utf8"
    )
  );
  return res
    .status(200)
    .send("Eshta 3aleeeeeeeeeeeeeeeeeeeeeeek, " + encryptedMessage);
});
app.listen(port, () => {
  console.log(`http:127.0.0.1:${port}`);
});

const convertFromJsonToArray = (json) => {
  return Object.values(json);
};
const encrypt = (message) => {
    const message_string=JSON.stringify(message)
    const message_String_bytes=aesjs.utils.utf8.toBytes(message_string);
    const encryptedBytes=serverCrypter.encrypt(message_String_bytes);
   const encryptedText=aesjs.utils.utf8.fromBytes(encryptedBytes);
   return encryptedText
};


const decryptAndCheckSignAndCheckPassword = (message) => {
  const clientPassword = "markmarkmarkmark";
var clientPasswordBytes = aesjs.utils.utf8.toBytes(clientPassword);
var clientCrypter = new aesjs.ModeOfOperation.ctr(
  clientPasswordBytes,
  new aesjs.Counter(5)
);
  const decryptedBytes = clientCrypter.decrypt(message);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log(decryptedText)
  const json = JSON.parse(decryptedText);
  console.log(json);
  if (json.password !== clientPassword) throw new error("WRONG PASSWORD");
  const address = sigUtil.recoverPersonalSignature({
    data: json.message_hash,
    signature: json.message_sign,
  });
  if (json.public_key !== address) throw new error("UNVERIFIED USER");
  return json;
};
