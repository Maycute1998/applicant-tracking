import { Env } from '../../enum'
const env = process.env.REACT_APP_ENVIROMENT
const BaseUrlByEnvironment = () => {
  switch (env) {
    case Env.Prod:
      return 'https://wmt8t90de4.execute-api.ap-southeast-2.amazonaws.com/Prod'
    case Env.Native:
      return 'https://localhost:7111'
    case Env.Dev:
      return 'https://localhost:7067'
  }
}
export { BaseUrlByEnvironment }
