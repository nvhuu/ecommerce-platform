// Example Vietnamese translations (for future use)
// To activate: Import this alongside English translations

import type { Translations } from "./form-messages.constant";

export const translationsVi: Translations = {
  auth: {
    validation: {
      required: {
        email: "Email là bắt buộc",
        password: "Mật khẩu là bắt buộc",
        firstName: "Tên là bắt buộc",
        lastName: "Họ là bắt buộc",
        confirmPassword: "Vui lòng xác nhận mật khẩu",
      },
      format: {
        email: "Email không hợp lệ",
      },
      length: {
        passwordMin: "Mật khẩu phải có ít nhất 6 ký tự",
        firstNameMin: "Tên phải có ít nhất 2 ký tự",
        lastNameMin: "Họ phải có ít nhất 2 ký tự",
      },
      match: {
        password: "Mật khẩu không khớp",
      },
    },
    labels: {
      email: "Email",
      password: "Mật khẩu",
      confirmPassword: "Xác nhận mật khẩu",
      firstName: "Tên",
      lastName: "Họ",
    },
    placeholders: {
      email: "email@example.com",
      emailAddress: "Địa chỉ email",
      password: "Mật khẩu",
      firstName: "Nguyễn",
      lastName: "Văn A",
    },
    buttons: {
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      createAccount: "Tạo tài khoản",
    },
    links: {
      forgotPassword: "Quên mật khẩu?",
      haveAccount: "Đã có tài khoản?",
      noAccount: "Chưa có tài khoản?",
    },
    titles: {
      welcomeBack: "Chào mừng trở lại",
      createAccount: "Tạo tài khoản mới",
      cmsAdmin: "Quản trị CMS",
    },
    descriptions: {
      login: "Nhập email và mật khẩu để đăng nhập vào tài khoản của bạn",
      register: "Nhập thông tin của bạn để tạo tài khoản mới",
      cmsLogin: "Đăng nhập vào tài khoản của bạn",
    },
  },
  common: {
    success: {
      loginSuccessful: "Đăng nhập thành công!",
      registerSuccessful: "Đăng ký thành công!",
    },
    error: {
      loginFailed: "Đăng nhập thất bại",
      registerFailed: "Đăng ký thất bại",
    },
  },
} as const;
