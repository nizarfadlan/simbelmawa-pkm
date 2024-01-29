import readline from 'readline';
import colors from 'colors';

export function Header(bearer, method = 'POST') {
  var headers = {
    Referer: 'https://simbelmawa.kemdikbud.go.id/v2/v2/authentication/basic/login',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    Origin: 'https://simbelmawa.kemdikbud.go.id',
    'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
  };

  if (method === 'POST') {
    headers['Content-Type'] = 'multipart/form-data';
  }

  if (bearer) {
    headers['Authorization'] = `Bearer ${bearer}`;
  }

  return headers;
}

export function Text(text, color) {
  colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'white',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
    success: 'green'
  });

  console.log(text[color]);
}


export const readInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function Input(prompt) {
  return new Promise((resolve) => {
    Text(prompt, 'prompt');
    readInput.question('?> ', (input) => {
      resolve(input);
    });
  });
}

export function validateToken(token) {
  const { expires_in, loginDate } = token;

  const currentTime = Math.floor(Date.now() / 1000);

  const expirationTime = loginDate + expires_in;

  if (currentTime > expirationTime) {
    return false;
  }

  return true;
}
