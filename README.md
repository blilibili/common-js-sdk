# common-js-sdk
封装经常使用的功能，方便业务二次开发
1.  wxPaySdkV2... 微信支付 v2 版本  由前端加密方法，签名然后调支付接口 发起微信支付
2.  http... 请求方法公共封装，有过期可自动重新请求token后再次发起请求
3.  wxH5...  h5唤起小程序功能
4.  debouceComponent.vue  防抖，节流通用抽象组件
使用例子: 
```
<Debounce :type="throttle">
    <input type="text" placeholder="函数防抖" @input="debouceMethods">
</Debounce>
```

|属性|属性值|
|type|debounce, throttle|
|time|时间跨度|
|event|绑定的事件，例如 input, click|
