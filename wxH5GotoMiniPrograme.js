/**
 * Created by liyigang on 1/12/2020.
 */
// 字符串加密成 hex 字符串
function sha1(s) {
  var data = new Uint8Array(encodeUTF8(s))
  var i, j, t;
  var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
  for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
  s[l - 1] = data.length << 3;
  var w = [], f = [
      function () { return m[1] & m[2] | ~m[1] & m[3]; },
      function () { return m[1] ^ m[2] ^ m[3]; },
      function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
      function () { return m[1] ^ m[2] ^ m[3]; }
    ], rol = function (n, c) { return n << c | n >>> (32 - c); },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776];
  m[2] = ~m[0], m[3] = ~m[1];
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0);
    for (j = 0; j < 80; j++)
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
        t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
        m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
    for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
  };
  t = new DataView(new Uint32Array(m).buffer);
  for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

  var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
    return (e < 16 ? "0" : "") + e.toString(16);
  }).join("");
  return hex;
}

//唤起小程序加密
function sha1Sign(ticket, nstr , time, url){
  console.log('签名参数', ticket, nstr , time, url)
  return sha1(
    'jsapi_ticket='+ ticket +'&' +
    'noncestr='+nstr+'&' +
    'timestamp='+time+'&' +
    'url=' + url
  )

}

function createRandomStr(num) {
  let e = num || 32,
    t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}

export const goToMiniPrograme = () => {
  //  获取access token接口  tips: 网页授权的access token和 客户端授权的不是同一个,要用客户端那个
  //  https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
  services.requestGetAccessForJsTicket().then((res) => {
    let returnJson = JSON.parse(res.data.data)

    let params = {
      accessToken: returnJson.access_token
    }
    //  获取js加密接口
    //  https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=access_token&type=jsapi
    services.requestGetJsTicket(params, {}).then((result) => {
      let returnChildJSON = JSON.parse(result.data.data)
      let time = new Date().getTime()
      let nonceStr = createRandomStr(16)
      let ticket = returnChildJSON.ticket
      let url = window.location.href
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
        appId: this.appid, // 必填，公众号的唯一标识
        timestamp: time, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: sha1Sign(ticket, nonceStr, time, url),// 必填，签名
        jsApiList: ['onMenuShareTimeline', "checkJsApi", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem"], // 必填，需要使用的JS接口列表
        openTagList: ['wx-open-launch-app', 'wx-open-launch-weapp'] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
      });

      window.wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
      });

      window.wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
        console.log('异常信息： ', res)
      });

      var btn = document.getElementById('launch-btn');
      btn.addEventListener('launch', function (e) {
        console.log('success');
      });
      btn.addEventListener('error', function (e) {
        console.log('fail', e.detail);
      });
    })
  })
}