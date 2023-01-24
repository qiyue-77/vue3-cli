import { createStore } from "vuex";
import Cookies from "js-cookie";

export default createStore({
  state: {
    isLogin: false,
    account: localStorage.getItem("account_info") || {},
  },
  mutations: {
    login(state, accountInfo: any) {
      localStorage.removeItem("account_info");
      localStorage.setItem("account_info", JSON.stringify(accountInfo));
      Cookies.set("access_token", accountInfo.access_token);
      state.account = JSON.stringify(accountInfo);
      state.isLogin = true;
    },
    loginout(state) {
      Cookies.remove("access_token");
      localStorage.removeItem("account_info");
      state.account = {};
      state.isLogin = false;
    },
  },
  actions: {
    getAccessToken() {
      return Cookies.get("access_token");
    },
  },
  modules: {},
});
