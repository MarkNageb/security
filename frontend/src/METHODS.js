export const encrypt=(password,message)=>{
    var passwordBytes = window.aesjs.utils.utf8.toBytes(password);
    var messageBytes = window.aesjs.utils.utf8.toBytes(message);
    var aesCtr = new window.aesjs.ModeOfOperation.ctr(passwordBytes, new window.aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(messageBytes);
    return encryptedBytes;
}