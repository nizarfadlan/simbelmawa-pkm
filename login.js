import axios from 'axios';
import { Header, Text } from './config.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function Login(username, password) {
  const options = Header(null)

  const res = await axios.post('https://simbelmawa.kemdikbud.go.id/api/auth/login', {username, password}, { headers: options })

  if (res.status !== 200) {
    Text(`[!] ${res.statusText}`, 'error')
    return
  }

  axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
  return res.data
}
