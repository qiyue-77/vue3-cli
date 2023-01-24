<template>
  <div class="login-page">
    <div class="login-content">
      <div class="right">
        <div class="login-box">
          <div class="login-title"></div>
          <div class="demo-tabs">
            密码
            <!-- <img src="../assets/loginbot.png" alt="" /> -->
          </div>
          <el-form
            style="margin-top: 32px"
            :model="form"
            :rules="rules"
            ref="ruleFormRef"
          >
            <el-form-item style="margin-bottom: 37px" prop="username">
              <el-input v-model="form.username" placeholder="用户名">
                <template #prefix>
                  <el-icon class="el-input__icon">
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 28px" prop="password">
              <el-input
                type="password"
                v-model="form.password"
                placeholder="密码"
                style="margin-bottom: 0px"
              >
                <template #prefix>
                  <el-icon class="el-input__icon">
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox
                v-model="rememberPassword"
                label="记住密码"
                size="large"
                style="margin-bottom: 28px"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="btn"
                type="primary"
                @click="submitForm(ruleFormRef)"
                >登录
              </el-button>
            </el-form-item>
          </el-form>
          <!-- </el-tab-pane>
          </el-tabs> -->
        </div>
        <div class="bottom">
          <span style="color: rgba(21, 22, 24, 0.72)"
            >本系统推荐使用 Google 浏览器:</span
          >
          <span
            @click="download('/ChromeSetup32bit.exe', 'ChromeSetup32bit.exe')"
            style="margin-left: 8px; cursor: pointer"
            >32位下载</span
          >
          <span
            @click="download('/ChromeSetup64bit.exe', 'ChromeSetup64bit.exe')"
            style="margin-left: 24px; cursor: pointer"
            >64位下载</span
          >
          <span
            @click="download('', 'userUsing.doc')"
            style="
              margin-left: 24px;
              color: #1f71ff;
              text-decoration: underline;
              cursor: pointer;
            "
            >用户手册下载</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import store from '@/store';
import { postLogin } from '@/services/user';
import { FormInstance, ElMessage, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
//事件总线
import { bus } from '@/utils/mitt';
const $router = useRouter();
const ruleFormRef = ref<FormInstance>();
const form = reactive({
  username: '',
  password: '',
});
//记住密码
const rememberPassword = ref(true);
const rules = reactive<FormRules>({
  username: [{ required: true, message: '用户名不能为空！' }],
  password: [{ required: true, message: '密码不能为空！' }],
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      onSubmit();
    }
  });
};
const onSubmit = async () => {
  const res: any = await postLogin(form);
  if (res.status === 0) {
    if (rememberPassword.value) {
      localStorage.setItem('usermsg', JSON.stringify(form));
    }
    store.commit('login', res.data);
    $router.replace({ path: '/home' });
  } else {
    ElMessage.error(res.msg || '登录失败');
  }
};
const download = (url: any, filename: any) => {
  const link = document.createElement('a');
  let newUrl: any;
  if (url == '') {
    newUrl =
      window.parent.document.location.origin + `/profile/jxst/userUsing.doc`;
    link.download = filename;
  } else {
    newUrl = url;
    link.download = filename;
  }
  link.href = newUrl;
  link.target = '_blank';
  link.style.display = 'none';
  document.body.append(link);
  link.click();
};
//将记住的密码赋值给两个输入框
const inputUser = () => {
  const userjosn = localStorage.getItem('usermsg') as any;
  const user = JSON.parse(userjosn);
  if (user) {
    form.username = user.username;
    form.password = user.password;
  }
};
onMounted(() => {
  bus.$on('senddata', (val: any) => {
    console.log(val);
  });
  inputUser();
});
</script>

<style lang="less">
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  box-shadow: 0 0 0 1000px #fff inset !important;
  /* -webkit-text-fill-color: #fff; */
  transition-delay: 99999s;
  transition: color 99999s ease-out, background-color 99999s ease-out;
}
.login-page {
  height: 1080px;
}
.login-content {
  display: flex;
  background: #fff;
  height: 1080px;

  .right {
    position: relative;
    width: 748px;
  }
  .bottom {
    position: absolute;
    bottom: 32px;
    align-items: center;
    justify-content: center;
    display: flex;
    width: 100%;
    span {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      color: #1f71ff;
    }
  }
  .login-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .login-title img {
    width: 96px;
    height: 96px;
  }

  .login-title span {
    font-family: 'FZDaHei-B02S';
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 47px;
    text-align: center;
    color: rgba(0, 0, 0, 0.72);
    width: 541.33px;
  }

  .demo-tabs {
    position: relative;
    width: 456px;
    margin-top: 95px;
    height: 53.33px;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 600;
    font-size: 18.6667px;
    line-height: 53.33px;
    color: rgba(21, 22, 24, 0.92);
    border-bottom: 1px solid rgba(15, 34, 67, 0.11);
    img {
      position: absolute;
      bottom: 0;
      left: 27px;
      width: 21.33px;
      height: 4px;
    }
  }

  .right .el-tabs .right .el-form .el-input__wrapper {
    background: #ffffff;
    box-shadow: 0px 10.6667px 85.3333px rgba(15, 34, 67, 0.1),
      0px 0px 1.33333px rgba(15, 34, 67, 0.16);
    border-radius: 5.33333px;
    border: none;
  }

  .login-box {
    position: absolute;
    left: 50%;
    top: 147.92px;
    transform: translateX(-50%);
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-tabs__header {
    margin-bottom: 32px;
  }

  .el-input__icon {
    color: #1f71ff;
  }

  .el-form .el-input__wrapper {
    border-bottom: none !important;
    height: 53.33px;
    background: #fefeff;
    box-shadow: 0px 10.6667px 85.3333px rgba(15, 34, 67, 0.1),
      0px 0px 1.33333px rgba(15, 34, 67, 0.16);
    border-radius: 5.33333px;
  }

  .el-form .btn {
    width: 456px;
    height: 53.33px;
    background: #1f71ff;
    box-shadow: 0px 2.66667px 0px rgba(0, 0, 0, 0.043);
    border-radius: 5.33333px;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 21.3333px;
    color: #ffffff;
  }

  .el-tabs__content {
    padding: 2px;
  }

  .el-checkbox.el-checkbox--large .el-checkbox__label {
    color: rgba(21, 22, 24, 0.92);
  }
}
</style>
