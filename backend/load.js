const express = require('express')
const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');
const crypto = require("crypto")
const app = express()
app.use(express.json())
const port = process.env.PORT || 5000
const password="mesh 3aref"
const serverPrivateKey="8eb58156062b52a580ea267f6e6bd71bcee5aa6d96c3614bf30e794d3756dfa3"
const msg =
'0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';

var cors = require('cors');
app.use(cors());


app.post('/decrypt',(req,res)=>{
    
    const data=req.body.data
    console.log("DATA")
    console.log(data)
    console.log("--------------")
    const decrypted=crypto.privateDecrypt(serverPrivateKey,data)
    console.log(decrypted)
})
app.post('/add_record/:encrption_key&:owner&:data', (req, res) => {
    const encryptedMessage = ethUtil.bufferToHex(
        Buffer.from(
            JSON.stringify(
                sigUtil.encrypt({
                    publicKey: req.params['encrption_key'],
                    data: req.params['data'],
                    version: 'x25519-xsalsa20-poly1305',
                })
            ),
            'utf8'
        )
    );
    return res.status(200).send("Eshta 3aleeeeeeeeeeeeeeeeeeeeeeek, " + encryptedMessage);
})

app.listen(port, () => {
    console.log(`http:127.0.0.1:${port}`)
})

