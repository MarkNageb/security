var express = require('express');
var Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const contract_abi = require("./abi");

const serverPublicKey='0x28e58c74e10d2d44776d6e75ec700657127b1980';
const serverPrivateKey ='bef01efaa9317284160e90b07ee2592e9e7cf29a17a29dd212ffdc0f76568a3a'

var app = express();
var port = 5000;

var SmartContractAddress = "0x688f940653331ef68f4E09465c6e3EA55fD8E63f";
var SmartContractABI = contract_abi;
var address = serverPublicKey
var privatekey = serverPrivateKey
var rpcurl ="https://rinkeby.infura.io/v3/e64a8dd6019a46a2b9c26f3fd4eee57b"

const patient="0xdca1cff5545c789cdac40bf24968d3713bde52df"

const sendData = async () => {

  console.log("in function");
  var provider = new Provider(privatekey, rpcurl);
  var web3 = new Web3(provider);
  var myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);
  try{
      const data={
          "name":"lool",
          "age":"69"
      }

      //storeVisitRecord doctorId,patientId,encrypted data, general or not                           from serverAddress
    //const idk=await myContract.methods.storeVisitRecord(serverPublicKey,patient,data,false).send({ from: address });
    //console.log("oldvalue", idk);
  }catch(error){
      console.log(error)
  }

  // patientID
  myContract.methods.retrieve(serverPublicKey).call({from:address})
  .then((res)=>{
      console.log(res)
  })
  
  .catch((error)=>{
    console.log(error)
  });
  //console.log(receipt);

//   var newvalue = await myContract.methods.retrieve().call();
//   console.log("newvalue", newvalue);

  //console.log("done with all things");

}

sendData();

app.listen(port);
console.log('listening on', port);