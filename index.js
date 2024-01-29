import { Text, Input, validateToken } from "./config.js";
import { DownloadLogbookKegiatan, DownloadLogbookKeuangan } from "./download.js";
import { CekUser, JumlahPageLogbookKegiatan, JumlahPageLogbookKeuangan, LogbookKegiatan, LogbookKeuangan, Usulan } from "./fitur.js";
import { Login } from "./login.js";
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

let usernameLogin;

async function Main() {
  const checkFile = await getFileLogin()
  if (!checkFile) await LoginMenu()

  let loginStatus = false

  try {
    const login = await fs.promises.readFile(`${usernameLogin}-login.json`, 'utf-8')
    if (login) {
      const loginJson = JSON.parse(login)
      if (!validateToken(loginJson)) {
        Text('Token kadaluarsa', 'error')
        Text('Silahkan login kembali', 'info')
        loginStatus = await LoginMenu()
      }
    }

    if (loginStatus || login) {
      while(true) {
        Text('\nTools Simbelmawa', 'verbose')
        Text('0. Exit', 'error')
        Text('1. Login\n2. Cek User\n3. Get Usulan\n4. Get Logbook Kegiatan\n5. Get Logbook Keuangan\n6. Download Docx Logbook Kegiatan\n7. Download Excel Logbook Keuangan', 'info')
        const menu = await Input('Pilih Menu: ')

        if (menu === '0' || menu.toLowerCase() === 'exit') {
          Text('Credits: Nizar', 'verbose')
          process.exit(0)
        } else {
          await Menu(menu)
        }
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      Text('File login tidak ditemukan', 'error')
      await LoginMenu()
      await Main()
    }
  }
}

async function LoginMenu() {
  const username = await Input('Username: ')
  const password = await Input('Password: ')
  const login = await Login(username, password)

  if (login) {
    usernameLogin = username
    Text('Berhasil login', 'success')
    const loginData = {
      ...login,
      loginDate: new Date()
    };
    await fs.promises.writeFile(`${username}-login.json`, JSON.stringify(loginData))
    .then(() => {
      Text('File berhasil disimpan', 'success');
      return true
    })
    .catch((err) => {
      Text('Gagal menyimpan file', 'error');
    });
    return false
  } else {
    Text('Gagal login', 'error')
    return false
  }
}

async function GetDataLogbook(type) {
  try {
    const usulan = await fs.promises.readFile(`${usernameLogin}-usulan.json`, 'utf-8')
    const usulanJson = JSON.parse(usulan)

    if (usulanJson) {
      const listUsulan = usulanJson.data.map((item, index) => {
        return `${index + 1}. ${item.judul.trim()}`
      })
      Text(`Pilih Usulan Kegiatan (1 - ${usulanJson.data.length}):\n ${listUsulan.join('\n ')}`, 'info')
      const pilihanUsulan = await Input('Pilih Usulan Kegiatan: ')

      if (pilihanUsulan < 1 || pilihanUsulan > usulanJson.data.length) {
        Text('Pilihan usulan tidak tersedia', 'error')
        return
      }

      if (!usulanJson.data[pilihanUsulan - 1].is_didanai) {
        Text('Usulan tidak didanai', 'error')
        return
      }

      const logbook = await fs.promises.readFile(`${usulanJson.data[pilihanUsulan - 1].id_usulan_kegiatan}-logbook-${type}.json`, 'utf-8')
      const logbookJson = JSON.parse(logbook)

      return {
        kegiatan: usulanJson.data[pilihanUsulan - 1],
        logbook: logbookJson
      }
    } else {
      Text('Gagal mendapatkan usulan', 'error')
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      Text('File usulan tidak ditemukan', 'error')
      return
    }
  }
}

async function Menu(input) {
  switch (input) {
    case "1": {
      await LoginMenu()
      break;
    }
    case "2": {
      const login = await fs.promises.readFile(`${usernameLogin}-login.json`, 'utf-8')
      const loginJson = JSON.parse(login)

      if (validateToken(loginJson)) {
        const usulan = await CekUser(loginJson.access_token)
        if (usulan) {
          Text('Berhasil mendapatkan data user', 'success')
          await fs.promises.writeFile(`${usernameLogin}-user.json`, JSON.stringify(usulan))
          .then(() => {
            Text('File berhasil disimpan', 'success');
          })
          .catch((err) => {
            Text('Gagal menyimpan file', 'error');
          });
        } else {
          Text('Gagal mendapatkan data user', 'error')
        }
      } else {
        await TokenKadaluarsa()
      }
      break;
    }
    case "3": {
      const login = await fs.promises.readFile(`${usernameLogin}-login.json`, 'utf-8')
      const loginJson = JSON.parse(login)

      if (validateToken(loginJson)) {
        const usulan = await Usulan(loginJson.access_token)
        if (usulan) {
          Text('Berhasil mendapatkan usulan', 'success')
          await fs.promises.writeFile(`${usernameLogin}-usulan.json`, JSON.stringify(usulan))
          .then(() => {
            Text('File berhasil disimpan', 'success');
          })
          .catch((err) => {
            Text('Gagal menyimpan file', 'error');
          });
        } else {
          Text('Gagal mendapatkan usulan', 'error')
        }
      } else {
        await TokenKadaluarsa()
      }
      break;
    }
    case "4": {
      const login = await fs.promises.readFile(`${usernameLogin}-login.json`, 'utf-8')
      const loginJson = JSON.parse(login)

      if (validateToken(loginJson)) {
        try {
          const usulan = await fs.promises.readFile(`${usernameLogin}-usulan.json`, 'utf-8')
          const usulanJson = JSON.parse(usulan)

          if (usulanJson) {
            const listUsulan = usulanJson.data.map((item, index) => {
              return `${index + 1}. ${item.judul.trim()}`
            })
            Text(`Pilih Usulan Kegiatan (1 - ${usulanJson.data.length}):\n ${listUsulan.join('\n ')}`, 'info')
            const pilihanUsulan = await Input('Pilih Usulan Kegiatan: ')

            if (pilihanUsulan < 1 || pilihanUsulan > usulanJson.data.length) {
              Text('Pilihan usulan tidak tersedia', 'error')
              return
            }

            if (!usulanJson.data[pilihanUsulan - 1].is_didanai) {
              Text('Usulan tidak didanai', 'error')
              return
            }

            let dataKegiatan = []
            const jumlahPerPage = await JumlahPageLogbookKegiatan(loginJson.access_token, usulanJson.data[pilihanUsulan - 1].id_usulan_kegiatan)
            let infoJadwal = null

            Text(`Total halaman logbook kegiatan ${jumlahPerPage}`, 'verbose')
            for (let i = jumlahPerPage; i >= 1; i--) {
              Text(`Mendapatkan logbook kegiatan halaman ${i}`, 'verbose')
              const kegiatan = await LogbookKegiatan(loginJson.access_token, usulanJson.data[pilihanUsulan - 1].id_usulan_kegiatan, i, jumlahPerPage)

              if (kegiatan) {
                dataKegiatan = [...dataKegiatan, ...kegiatan.data]
                infoJadwal = {
                  pesan: kegiatan.info_jadwal.pesan,
                  is_kegiatan_aktif: kegiatan.info_jadwal.is_kegiatan_aktif,
                  tgl_mulai: kegiatan.info_jadwal.tgl_mulai,
                  tgl_berakhir: kegiatan.info_jadwal.tgl_berakhir
                }
              }
            }

            if (dataKegiatan.length > 0) {
              Text('Info Kegiatan:', 'info')
              Text(`  Pesan: ${infoJadwal?.pesan}`, 'data')
              Text(`  Kegiatan Aktif: ${infoJadwal?.is_kegiatan_aktif ? "Iya" : "Tidak"}`, 'data')
              Text(`  Tanggal Mulai: ${infoJadwal?.tgl_mulai}`, 'data')
              Text(`  Tanggal Berakhir: ${infoJadwal?.tgl_berakhir}`, 'data')

              Text('Berhasil mendapatkan logbook kegiatan', 'success')
              await fs.promises.writeFile(`${usulanJson.data[pilihanUsulan - 1].id_usulan_kegiatan}-logbook-kegiatan.json`, JSON.stringify(dataKegiatan))
              .then(() => {
                Text('File berhasil disimpan', 'success');
              })
              .catch((err) => {
                Text('Gagal menyimpan file', 'error');
              });
            } else {
              Text('Gagal mendapatkan logbook kegiatan', 'error')
            }
          } else {
            Text('Gagal mendapatkan usulan', 'error')
          }
        } catch (error) {
          if (error.code === 'ENOENT') {
            Text('File usulan tidak ditemukan', 'error')
            break;
          }
        }
      } else {
        await TokenKadaluarsa()
      }
      break;
    }
    case "5": {
      const login = await fs.promises.readFile(`${usernameLogin}-login.json`, 'utf-8')
      const loginJson = JSON.parse(login)

      if (validateToken(loginJson)) {
        try {
          const usulan = await fs.promises.readFile(`${usernameLogin}-usulan.json`, 'utf-8')
          const usulanJson = JSON.parse(usulan)

          if (usulanJson) {
            const listUsulan = usulanJson.data.map((item, index) => {
              return `${index + 1}. ${item.judul.trim()}`
            })
            Text(`Pilih Usulan Kegiatan (1 - ${usulanJson.data.length}):\n ${listUsulan.join('\n ')}`, 'info')
            const pilihanUsulan = await Input('Pilih Usulan Kegiatan: ')

            if (pilihanUsulan < 1 || pilihanUsulan > usulanJson.data.length) {
              Text('Pilihan usulan tidak tersedia', 'error')
              return
            }

            if (!usulanJson.data[pilihanUsulan - 1].is_didanai) {
              Text('Usulan tidak didanai', 'error')
              return
            }

            let dataKeuangan = []
            const jumlahPerPage = await JumlahPageLogbookKeuangan(loginJson.access_token, usulanJson.data[pilihanUsulan - 1].id_usulan_kegiatan)
            let infoJadwal = null

            Text(`Total halaman logbook keuangan ${jumlahPerPage}`, 'verbose')
            for (let i = jumlahPerPage; i >= 1; i--) {
              Text(`Mendapatkan logbook keuangan halaman ${i}`, 'verbose')
              const keuangan = await LogbookKeuangan(loginJson.access_token, usulanJson.data[pilihanUsulan - 1].id_usulan_kegiatan, i, jumlahPerPage)

              if (keuangan) {
                dataKeuangan = [...dataKeuangan, ...keuangan.data]
                infoJadwal = {
                  pesan: keuangan.info_jadwal.pesan,
                  is_kegiatan_aktif: keuangan.info_jadwal.is_kegiatan_aktif,
                  tgl_mulai: keuangan.info_jadwal.tgl_mulai,
                  tgl_berakhir: keuangan.info_jadwal.tgl_berakhir
                }
              }
            }

            if (dataKeuangan.length > 0) {
              Text('Info Kegiatan:', 'info')
              Text(`  Pesan: ${infoJadwal?.pesan}`, 'data')
              Text(`  Kegiatan Aktif: ${infoJadwal?.is_kegiatan_aktif ? "Iya" : "Tidak"}`, 'data')
              Text(`  Tanggal Mulai: ${infoJadwal?.tgl_mulai}`, 'data')
              Text(`  Tanggal Berakhir: ${infoJadwal?.tgl_berakhir}`, 'data')

              Text('Berhasil mendapatkan logbook keuangan', 'success')
              await fs.promises.writeFile(`${usulanJson.data[pilihanUsulan - 1].id_usulan_kegiatan}-logbook-keuangan.json`, JSON.stringify(dataKeuangan))
              .then(() => {
                Text('File berhasil disimpan', 'success');
              })
              .catch((err) => {
                Text('Gagal menyimpan file', 'error');
              });
            } else {
              Text('Gagal mendapatkan logbook keuangan', 'error')
            }
          } else {
            Text('Gagal mendapatkan usulan', 'error')
          }
        } catch (error) {
          if (error.code === 'ENOENT') {
            Text('File usulan tidak ditemukan', 'error')
            break;
          }
        }
      } else {
        await TokenKadaluarsa()
      }
      break;
    }
    case "6": {
      const data = await GetDataLogbook('kegiatan')
      if (!data) {
        Text('Gagal mendapatkan logbook kegiatan', 'error')
        break
      }

      const { kegiatan, logbook } = data
      await DownloadLogbookKegiatan(kegiatan, logbook)
      break;
    }
    case "7": {
      const data = await GetDataLogbook('keuangan')
      if (!data) {
        Text('Gagal mendapatkan logbook keuangan', 'error')
        break
      }

      const { kegiatan, logbook } = data
      await DownloadLogbookKeuangan(kegiatan.id_usulan_kegiatan, logbook)
      break;
    }
    default: {
      Text('Menu tidak tersedia', 'error')
      break;
    }
  }
}

async function getFileLogin() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const files = await fs.promises.readdir(__dirname, 'utf-8');

  try {
    const filePath = files.filter((file) => file.includes('-login.json'));
    if (filePath.length === 0) {
      return false
    }

    const filePathList = filePath.map((files, index) => {
      return `${index + 1}. ${files.split('-login.json')[0]}`
    })

    Text(`Pilih History (1 - ${filePath.length}):`, 'info')
    Text(' 0. Login Baru', 'help')
    Text(` ${filePathList.join('\n ')}`, 'data')
    const pilihFile = await Input('Pilih History Login: ')

    if (pilihFile != '0') {
      usernameLogin = filePath[pilihFile - 1].split('-login.json')[0]
      return true
    }

    return false
  } catch (err) {
    Text(`Gagal membaca file, ${err}`, 'error')
    return false
  }
}

async function TokenKadaluarsa() {
  Text('Token kadaluarsa', 'error')
  Text('Silahkan login kembali', 'info')
  await LoginMenu()
}

Main()
