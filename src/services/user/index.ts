import Service from '..';
// 登录
export const postLogin = (data: any = {}) => {
  return Service.post({
    url: '/api/login',
    data: data,
    showLoading: false,
  });
};
//登出
export const Loginout = (data: any = {}) => {
  return Service.get({
    url: '/api/account/logout',
    data: data,
    showLoading: false,
  });
};
