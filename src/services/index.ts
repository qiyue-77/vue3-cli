// service统一出口
import HYRequest from './http';
import Cookies from 'js-cookie';
const TIME_OUT = 10 * 1000;
// 创建一个新的请求,并传入参数
const hyRequest = new HYRequest({
  // 传入baseurl
  //baseURL: BASE_URL,
  // 传入超时时间
  timeout: TIME_OUT,
  // 传入拦截器
  interceptors: {
    requestInterceptor: (config: any) => {
      // 给当前请求实例所有的请求添加token
      const token: any = Cookies.get('access_token');
      if (token) {
        // 模板字符串进行拼接
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    requestInterceptorCatch: (err) => {
      return err;
    },
    responseInterceptor: (res) => {
      return res;
    },
    responseInterceptorCatch: (err) => {
      return err;
    },
  },
});

export default hyRequest;
