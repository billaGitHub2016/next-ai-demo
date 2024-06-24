import { object, string } from "zod"
 
export const signInSchema = object({
  email: string({ required_error: "请填写用户邮箱" })
    .min(1, "请填写用户邮箱")
    .email("Invalid email"),
  password: string({ required_error: "请填写登录密码" })
    .min(1, "请填写登录密码")
})