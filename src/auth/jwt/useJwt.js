import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'
import jwtOverrideConfig from './jwtOverrideConfig'

const { jwt } = useJwt(axios, { ...jwtOverrideConfig })
export default jwt
