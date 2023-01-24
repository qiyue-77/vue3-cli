import axios from 'axios';
// 导入axios实例的类型
import type { AxiosInstance } from 'axios';
import type { HYRequestInterceptors, HYRequestConfig } from './type';
import router from '@/router';
import store from '@/store';
// 引入loading组件
import { ElMessage } from 'element-plus';
// 默认显示loading
const DEAFULT_LOADING = false;
let isValidLogin = false;
class HYRequest {
  // axios实例
  instance: AxiosInstance;
  // 当前请求实例的拦截器
  interceptors?: HYRequestInterceptors;
  // 是否显示loading
  showLoading: boolean;

  constructor(config: HYRequestConfig) {
    // 创建axios实例
    this.instance = axios.create(config);
    // 保存基本信息
    this.interceptors = config.interceptors;
    this.showLoading = config.showLoading ?? DEAFULT_LOADING;

    // 使用拦截器
    // 1.从config中取出的拦截器是对应的实例的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    // 2.添加所有的实例都有的拦截器
    // 请求的时候,先添加的拦截器后执行
    // 响应的时候,先添加的拦截器先执行
    // this.instance.interceptors.request.use(
    //   (config) => {
    //     // 所有的请求都添加loading
    //     if (this.showLoading) {
    //       // 添加loading
    //       ElLoading.service({
    //         lock: true,
    //         text: "正在请求数据....",
    //         background: "rgba(0, 0, 0, 0.1)",
    //       });
    //     }
    //     return config;
    //   },
    //   (err) => {
    //     return err;
    //   }
    // );

    this.instance.interceptors.response.use(
      (res: any) => {
        // 所有的请求,将loading移除
        // ElLoading.service()?.close();
        // 因为我们需要的就是res.data,所以我们可以在所有请求实例的请求的响应拦截器里面,直接把res.data返回,这样我们就可以直接使用了
        const data = res.data;
        if (data) {
          if (data.status === 200 || data.status === 0) {
            isValidLogin = true;
            return data;
          } else {
            ElMessage.error(data.msg);
            return Promise.reject(data.msg);
          }
        } else {
          ElMessage.error(res.msg);
          return Promise.reject(res.msg);
        }
      },
      (err) => {
        // 所有的请求,将loading移除
        // ElLoading.service()?.close();
        // 判断不同的HttpErrorCode显示不同的错误信息
        if (err.response.status === 401 || err.response.status === 403) {
          if (isValidLogin) {
            ElMessage.error(
              err.response.data.msg || '登录已经失效，请重新登录'
            );
          }
          store.commit('loginout');
          router.replace({ path: '/' });
        } else if (err.response && err.response.status === 405) {
          ElMessage.error(err.response.statusText);
        } else {
          ElMessage.error(err.response.data.msg);
        }
        return Promise.reject(err);
      }
    );
  }

  // 1.传入返回结果的类型T,这样在Promise中我们就知道返回值的类型是T了
  // 2.通过HYRequestConfig<T>,将返回值类型T告诉接口,从而在接口的返回响应拦截中指明返回值类型就是T
  request<T>(config: HYRequestConfig<T>): Promise<T> {
    // 返回一个Promise对象,好让使用者在外面拿到数据
    return new Promise((resolve, reject) => {
      // 1.单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        // 如果有单个请求的拦截器,就执行一下这个函数,然后返回
        config = config.interceptors.requestInterceptor(config);
      }

      // 2.判断单个请求是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading;
      }

      this.instance
        // request里面有两个泛型,第一个泛型默认是any,第二个泛型是AxiosResponse
        // 由于前面我们已经将res.data直接返回了,所以其实最后的数据就是T类型的,所以我们在第二个泛型中要指定返回值的类型T
        .request<any, T>(config)
        .then((res) => {
          // 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          // 2.将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEAFULT_LOADING;

          // 3.将结果resolve返回出去
          resolve(res);
        })
        .catch((err) => {
          // 将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEAFULT_LOADING;
          reject(err);
          return err;
        });
    });
  }

  get<T>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, params: config.data, method: 'GET' });
  }

  post<T>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  delete<T>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({
      ...config,
      params: config.data,
      method: 'DELETE',
    });
  }

  put<T>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' });
  }
}

export default HYRequest;
