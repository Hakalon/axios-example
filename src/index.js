const axios = require('axios');
const JsSHA = require('jssha');

const headers = getAuthorizationHeader();
const city = 'Taipei';
const route = '912';

const motcReqSender = axios.create({
  baseURL: 'http://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/',
  headers
});

console.log('Start sending request by axios!');
motcReqSender.get(`${city}/${route}?$top=1&$format=JSON`)
  .then(resp => {
    console.log('This is the response: ');
    // console.log(resp);
    console.log(resp.data);
  })
  .catch(err => {
    console.log('There is something wrong: ');
    console.log(err);
  });

// MOTC授權認證
function getAuthorizationHeader() {
  const appID = '31c5632cc08d4421abf734566fd50ed2';
  const appKey = 'CNaXup9EDeew3oyoa8N8CWdE2ZI';
  const GMTString = new Date().toGMTString();
  const shaObj = new JsSHA('SHA-1', 'TEXT');

  shaObj.setHMACKey(appKey, 'TEXT');
  shaObj.update(`x-date: ${GMTString}`);

  const HMAC = shaObj.getHMAC('B64');
  const authorization = `hmac username="${appID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;

  // 若要減少傳輸可以再加上Accept-Encoding: 'gzip'，但使用時就必須額外做解壓縮的動作，否則會得到一串亂碼。
  return {
    Authorization: authorization, 'X-Date': GMTString
  };
}
