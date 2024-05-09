import { Env } from '../../enum'
const env = process.env.REACT_APP_ENVIROMENT
const BaseUrlByEnvironment = () => {
  switch (env) {
    case Env.Prod:
      return 'https://wmt8t90de4.execute-api.ap-southeast-2.amazonaws.com/Prod'
    case Env.Native:
      return 'https://localhost:8000'
    case Env.Dev:
      return 'https://localhost:8000'
  }
}
export { BaseUrlByEnvironment }

