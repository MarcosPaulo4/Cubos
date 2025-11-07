import 'dotenv/config'

export const env = {
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  PORT: process.env.PORT || 3000,
}
