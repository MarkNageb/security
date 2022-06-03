import React, { useEffect } from "react";
import Sickdog from "./sickdog.png";
import { Moralis } from "moralis";
import { useNavigate } from "react-router-dom";


const Http = new XMLHttpRequest();
let url = "http://127.0.0.1:5500/add_record";
let pageLoaded = false;
const serverUrl = "https://fte4ajr1ecuv.usemoralis.com:2053/server";
const appId = "gu2NSIijo65u7hVO1otneuNoPlw29tMQg16O3D26";

function Login({router}) {
    const navigate = useNavigate()
  useEffect(() => {
    Moralis.start({ serverUrl, appId });
  }, []);

  const login = async () => {
    await Moralis.authenticate().then( (user)=> {
        console.log(user)
        navigate("/dashboard")
    })
}
  return (
    <div className="text-center">
      <main className="form-signin w-100 m-auto">
        <img className="mb-4" src={Sickdog} alt="" width="152" height="137" />
        <h2>Sick Pupper Inc.</h2>
        <div className="form-floating">
          <button
            onClick={() => {
              console.log("login");
              login()
            }}
            id="btn-login"
            className="w-100 btn btn-lg btn-primary"
            type="submit"
          >
            Sign in
          </button>
          <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
        </div>
      </main>
    </div>
  );
}

export default Login;
