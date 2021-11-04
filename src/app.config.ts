export default () => ({
  port: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET
});