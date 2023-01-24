import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// 定义一个接口,表示这个接口的实例要有这4个属性,当然不是必须的,是可选的
// 传入一个泛型,默认值是AxiosResponse
export interface HYRequestInterceptors<T = AxiosResponse> {
  // 拦截器都是可选的
  // 请求拦截
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  // 请求错误拦截
  requestInterceptorCatch?: (error: any) => any;
  // 响应拦截
  // 由于我们在前面直接将res.data返回了,所以这里如果传入了T,那么返回的类型就是传入的T
  responseInterceptor?: (res: T) => T;
  // 响应错误拦截
  responseInterceptorCatch?: (error: any) => any;
}

// 定义一个新的接口,继承于AxiosRequestConfig,表示我们传入的参数要有interceptors和showLoading,当然也是可选的
export interface HYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  // 对原来的AxiosRequestConfig进行扩展,添加拦截器和是否显示loading,可选的
  interceptors?: HYRequestInterceptors<T>;
  showLoading?: boolean;
}
