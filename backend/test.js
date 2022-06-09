//Imports
const express = require("express");
const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");
const contract_abi = require("./abi");
const aesjs = require("aes-js");
const sigUtil = require("@metamask/eth-sig-util");
const cors = require("cors");
// Express
const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;
// Server keys
const serverPublicKey = "0x28e58c74e10d2d44776d6e75ec700657127b1980";
const serverPrivateKey =
  "bef01efaa9317284160e90b07ee2592e9e7cf29a17a29dd212ffdc0f76568a3a";
// Other keys
const SmartContractAddress = "0x5fC157104d7167CcA143dEa137FFa4e63c612B5D";
const SmartContractABI = contract_abi;
const address = serverPublicKey;
const privatekey = serverPrivateKey;
const rpcurl = "https://rinkeby.infura.io/v3/e64a8dd6019a46a2b9c26f3fd4eee57b";

//const patient="0xdca1cff5545c789cdac40bf24968d3713bde52df"

app.post("/add-data", async (req, res) => {
  console.log("ADD PATIENT");
  try {
    // Initialization of contract
    const provider = new Provider(privatekey, rpcurl);
    const web3 = new Web3(provider);
    const myContract = new web3.eth.Contract(
      SmartContractABI,
      SmartContractAddress
    );
    try {
      // DECODING AND PARSING DATA
      const data = convertFromJsonToArray(req.body.data);
      const decryptedData = decryptAndCheckSignAndCheckPassword(data);
      //console.log(decryptedData)
      const encryptedData = encryptJSON(decryptedData);
      try {
        console.log("DOCTOR: ",decryptedData.doctor_key)
        console.log("PATIENT: ",decryptedData.patient_key)
        console.log("ENCRYPTED: ",encryptedData)
        console.log("GENERAL: ",decryptedData.general)
        //storeVisitRecord patientId,doctorId,encrypted data, general or not                           from serverAddress
        const contract = await myContract.methods.storeVisitRecord(decryptedData.patient_key,decryptedData.doctor_key,decryptedData,false).send({ from: address });
        console.log(contract);
        res.send("SUCCESS");
      } catch (error) {
        console.log(error);
        res.status(400).send("ERROR INSERTING RECORD");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("WRONG PASSWORD");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("ERROR IN INITIALIZATION");
  }
});

const sendData = async () => {
  var provider = new Provider(privatekey, rpcurl);
  var web3 = new Web3(provider);
  var myContract = new web3.eth.Contract(
    SmartContractABI,
    SmartContractAddress
  );
  try {
    const data = {
      name: "lool",
      age: "69",
    };

    //storeVisitRecord doctorId,patientId,encrypted data, general or not                           from serverAddress
    //const idk=await myContract.methods.storeVisitRecord(serverPublicKey,patient,data,false).send({ from: address });
    //console.log("oldvalue", idk);
  } catch (error) {
    console.log(error);
  }

  // patientID
  myContract.methods
    .retrieve(serverPublicKey)
    .call({ from: address })
    .then((res) => {
      console.log(res);
    })

    .catch((error) => {
      console.log(error);
    });
  //console.log(receipt);

  //   var newvalue = await myContract.methods.retrieve().call();
  //   console.log("newvalue", newvalue);

  //console.log("done with all things");
};

//sendData();

app.listen(port);
console.log("listening on", port);

const convertFromJsonToArray = (json) => {
  return Object.values(json);
};
const encryptJSON = (JSONmessage) => {
  const serverPassword = "zebyzebyzebyzebyzebyzebyzebyzeby";
  const serverPasswordBytes = aesjs.utils.utf8.toBytes(serverPassword);
  const serverCrypter = new aesjs.ModeOfOperation.ctr(
    serverPasswordBytes,
    new aesjs.Counter(5)
  );
  const message_string = JSON.stringify(JSONmessage);
  const message_String_bytes = aesjs.utils.utf8.toBytes(message_string);
  const encryptedBytes = serverCrypter.encrypt(message_String_bytes);
  const encryptedText = aesjs.utils.utf8.fromBytes(encryptedBytes);
  return encryptedText;
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
  //console.log(decryptedText);
  const json = JSON.parse(decryptedText);
  console.log(json.password !== clientPassword);
  if (json.password != clientPassword) throw new Error("WRONG PASSWORD");
  const address = sigUtil.recoverPersonalSignature({
    data: json.message_hash,
    signature: json.message_sign,
  });
  if (json.doctor_key  !== address) throw new Error("UNVERIFIED USER");
  return json;
};
