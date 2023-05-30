
const crypto = require('crypto');

exports.aadharAuthenticationController= async(req,res)=>{
    const aadharNumber = req.body.aadharNumber;
    const biometricData = '...'; // base64 encoded biometric data

const authXml = `<Auth xmlns="http://www.uidai.gov.in/authentication/uid-auth-request/2.0"
                   uid="${aadharNumber}"
                   tid="public"
                   ac="public"
                   sa="public"
                   ver="2.5"
                   txnId="12345678901234567890123456789012">
                   <Uses pi="n" pa="n" pfa="n" bio="y"/>
                   <Meta fdc="NA" idc="NA" lot="P" lov="560008" />
                   <Skey ci="20131023">${publicKey}</Skey>
                   <Data type="X">${biometricData}</Data>
               </Auth>`;

const signature = crypto.createSign('RSA-SHA256');
signature.update(authXml);
const signedXml = signature.sign(privateKey, 'base64');

const options = {
  url: 'https://auth.uidai.gov.in/2.5/',
  headers: {
    'Content-Type': 'application/xml',
    'Accept': 'application/xml'
  },
  body: authXml,
  qs: {
    'signature': signedXml
  }
};

request.post(options, (error, response, body) => {
  if (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } else {
    res.send(body);
  }
});
}
