import React,{useEffect} from 'react'
import {Formik,Form,Field} from "formik"
import { sha256 } from 'js-sha256';
import { Moralis } from "moralis";
import { encrypt } from './METHODS';
import axios from 'axios';

const serverUrl = "https://fte4ajr1ecuv.usemoralis.com:2053/server";
const appId = "gu2NSIijo65u7hVO1otneuNoPlw29tMQg16O3D26";
const url="http://localhost:5000/"

function AddPatient() {
    useEffect(() => {
        Moralis.start({ serverUrl, appId });
      }, []);

    const submit=async(values)=>{
        console.log(values)
        const message={
            "name":values.name,
            "age":values.age,
            "height":values.height,
            "weight":values.weight,
            "gender":values.gender,
        }
        const message_string=JSON.stringify(message)
        const message_hash="0x"+sha256(message_string)
        const message_sign = await window.ethereum.request({
            method: "personal_sign",
            params: [Moralis.User.current().get("ethAddress"), message_hash],
        });
        const body={
            message:message_string,
            message_sign:message_sign,
            message_hash:message_hash,
            "password":values.password,
            "key":values.key,
            "public_key":Moralis.User.current().get("ethAddress")
        }
        const body_string=JSON.stringify(body)
        const encryptedBody=encrypt(values.password,body_string)
        axios.post(url+"add-patient",{data:encryptedBody})
    }
  return (
    <div>
        <h1>AddPatient</h1>
        <Formik initialValues={{
            name:"",
            age:"",
            height:"",
            weight:"",
            gender:"",
            key:"",
            password:"",
        }}
        onSubmit={submit}
        >
            {()=>{
                return(
                    <Form>
                        <div>
                            name
                            <Field name="name"   />
                        </div>
                        <div>
                            age
                            <Field name="age"   />
                        </div>
                        <div>
                            height
                            <Field name="height"   />
                        </div>
                        <div>
                            weight
                            <Field name="weight"   />
                        </div>
                        <div>
                            gender
                            <Field name="gender"   />
                        </div>
                        <div>
                            public key
                            <Field name="key"   />
                        </div>
                        <div>
                            password
                            <Field name="password"   />
                        </div>
                        <button type='submit'>submit</button>
                    </Form>
                )
            }}
        </Formik>

    </div>
  )
}

export default AddPatient