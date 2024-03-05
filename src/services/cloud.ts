export const app = cloudbase.init({
  env: 'ai-tools-6guwawtsb724a7e7',
})
export const auth = app.auth({
  persistence: "local" //用户显式退出或更改密码之前的30天一直有效
})
export const db = app.database()