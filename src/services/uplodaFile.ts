import axios from 'axios';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
const config: any = {
  timeout: 100000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
const Axios: any = axios;
const token: any = Cookies.get('access_token');
if (token) {
  // 模板字符串进行拼接
  config.headers.Authorization = `Bearer ${token}`;
}

export const uploadFile = async (url: string, formData?: any) => {
  try {
    const rsp = await Axios.post(
      url, //请求后端的url
      formData,
      config
    );
    console.log(rsp);
    if (rsp.data.status === 0 || rsp.status === 200) {
      return rsp.data;
    } else {
      ElMessage.error('上传失败');
      return rsp.data;
    }
  } catch (e: any) {
    ElMessage.error('上传接口报错' + e);
  }
};
