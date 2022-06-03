import React, { useEffect, useState } from "react";
import { Moralis } from "moralis";
import axios from "axios";
import { sha256 } from 'js-sha256';
import { encryptPublicLong, decryptPrivateLong } from '@lsqswl/rsaencrypt'

const serverUrl = "https://fte4ajr1ecuv.usemoralis.com:2053/server";
const appId = "gu2NSIijo65u7hVO1otneuNoPlw29tMQg16O3D26";
const serverPublicKey = "0x46379f914B6B9e648F282772e5F5c44D4A457F88";
const url="http://localhost:5000/"
//hash public key of user, password, data,hash of data
// sign message
// sign= encrypt with private key
function Dashboard() {
  useEffect(() => {
    Moralis.start({ serverUrl, appId });
    getBalances();
  }, []);
  // console.log(Moralis.User.current())
  const [rink, updateRink] = useState("");
  const [eth, updateEth] = useState("");

  const getBalances = async () => {
    const optionsRink = {
      chain: "rinkeby",
      address: Moralis.User.current().get("ethAddress"),
    };
    const optionsEth = {
      chain: "eth",
      address: Moralis.User.current().get("ethAddress"),
    };
    const balanceRink = await Moralis.Web3API.account.getNativeBalance(
      optionsRink
    );
    const balanceEth = await Moralis.Web3API.account.getNativeBalance(
      optionsEth
    );

    let contentRink = (balanceRink.balance / 1e18).toFixed(5);
    updateRink(contentRink);
    let contentEth = (balanceEth.balance / 1e18).toFixed(5);
    updateEth(contentEth);
  };
  const ethSign = async () => {
    try {
      const message="eeeeeehhhhh"
      const message_hash=sha256(message)
      const message_sign = await window.ethereum.request({
        method: "personal_sign",
        params: [Moralis.User.current().get("ethAddress"), message_hash],
      });
  
      // create json and stringify

      const json={
        "message":message,
        "message_hash":message_hash,
        "message_sign":message_sign,
        "password":"mesh 3aref",
        "password_hash":sha256("mesh 3aref"),
        "public_key":Moralis.User.current().get("ethAddress")

      }
      const json_string=JSON.stringify(json);

      // sign encryption using my private key
      // const encrypt = new window.JSEncrypt();
      // encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB-----END PUBLIC KEY-----")
      // const encrypted = encrypt.encrypt(json_string);
      // console.log(encrypted)
      // axios.post(url+"decrypt",{
      //   data:encrypted
      // })
      const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+SJMkWLJ/NiKL6NRsIsjvdzyu\navEnbv+WzsHENko5AFGshfAbmjp19AJ/iaW0Jg1xu0XeEigT4UtnkTEuho8lEgRy\nULltedWgUprEGIwIHnAbJ1GJZCe3NtasaaleOPU67UkkQ9fKGXMujiCUTq1dTnd7\ntOosAeWrPpnOnx6gyQIDAQAB\n'
      const encryptData = encryptPublicLong(json_string, serverPublicKey)
        console.log('result: ' + encryptData)

    } catch (err) {
      console.error(err);
    }
    
  };
  const encrypt = async () => {
    // axios
    //   .post(url + "/" + `${result}` + "&7amada&7amada2")
    //   .then((res) => {})
    //   .catch((error) => {});

    // .request({
    //     method: 'eth_getEncryptionPublicKey',
    //     params: [Moralis.User.current().get('ethAddress')], // you must have access to the specified account
    // })
    // .then((result) => {
    //     console.log(result)

    // })
    // .catch((error) => {
    //     if (error.code === 4001) {
    //         // EIP-1193 userRejectedRequest error
    //         console.log("We can't encrypt anything without the key.");
    //     } else {
    //         console.error(error);
    //     }
    // });
  };

  return (
    <div>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-10" href="#">
          Sick Pupper Inc.
        </a>
        <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <a id="btn-signout" className="nav-link px-3 fs-10" href="#">
              Sign out
            </a>
          </div>
        </div>
      </header>
      <div className="padder">
        <div className="container-fluid">
          <div className="row">
            <div className="column1">
              <div className="row">
                <div className="subcolumn">
                  <h2>
                    Balance
                    <a id="get-balance" className="nav-link" href="#">
                      <span
                        data-feather="refresh-cw"
                        className="align-text-center"
                      ></span>
                    </a>
                  </h2>
                </div>
              </div>
              <div className="row">
                <div className="subcolumn">
                  <div id="userB" className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Token</th>
                          <th scope="col">Balance</th>
                        </tr>
                      </thead>
                      <tbody id="theBalance">
                        <tr>
                          <td>Rinkeby</td>
                          <td>{rink}</td>
                        </tr>

                        <tr>
                          <td>Ethereum</td>
                          <td>{eth}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="column_small"></div>
            <div className="column2">
              <div className="row">
                <div className="subcolumn">
                  <h2>
                    Add a Record
                    <a id="add_rec" className="nav-link" href="#">
                      <span
                        data-feather="plus-circle"
                        className="align-text-center"
                      ></span>
                    </a>
                  </h2>
                </div>
              </div>
              <div className="row">
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-name"
                      placeholder="Name"
                    />
                    <label htmlFor="user-Name">Name</label>
                  </div>
                </div>
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-Gender"
                      placeholder="Name"
                    />
                    <label htmlFor="user-Gender">Gender</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-Age"
                      placeholder="Name"
                    />
                    <label htmlFor="user-Age">Age</label>
                  </div>
                </div>
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-Weigth"
                      placeholder="Name"
                    />
                    <label htmlFor="user-Weigth">Weigth</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-Height"
                      placeholder="Name"
                    />
                    <label htmlFor="user-Height">Height</label>
                  </div>
                </div>
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-BP"
                      placeholder="Name"
                    />
                    <label htmlFor="user-BP">Blood Pressure</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-VR"
                      placeholder="Name"
                    />
                    <label htmlFor="user-VR">Visit Reason </label>
                  </div>
                </div>
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-Medication"
                      placeholder="Name"
                    />
                    <label htmlFor="user-Medication">Medication</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-Diagnosis"
                      placeholder="Name"
                    />
                    <label htmlFor="user-Diagnosis">Diagnosis</label>
                  </div>
                </div>
                <div className="subcolumn">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="user-Misc"
                      placeholder="Name"
                    />
                    <label htmlFor="user-Misc">Misc</label>
                  </div>
                </div>
              </div>

              <button onClick={ethSign}> EH</button>
            </div>
          </div>

          <div>
            <div>
              <h2>
                Transactions
                <a id="get-trans" className="nav-link" href="#">
                  <span
                    data-feather="refresh-cw"
                    className="align-text-center"
                  ></span>
                </a>
              </h2>

              <div id="userT" className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Transaction</th>
                      <th scope="col">Block Number</th>
                      <th scope="col">Age</th>
                      <th scope="col">Type</th>
                      <th scope="col">Fee</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody id="theTrans"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
