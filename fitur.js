import axios from 'axios';
import { Header, Text } from './config.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function Usulan(bearer) {
  const options = Header(bearer, 'GET')

  const res = await axios.get('https://simbelmawa.kemdikbud.go.id/api/mahasiswa/dashboard', { headers: options })

  if (res.status !== 200) {
    Text(`[!] ${res.statusText}`, 'error')
    return
  }

  res.data.data.forEach((item, index) => {
    Text(`Data ${index + 1}:`, 'info');
    Text(`ID Usulan Kegiatan: ${item.id_usulan_kegiatan}`, 'data');
    Text(`Nama Skema: ${item.nama_skema}`, 'data');
    Text(`Judul: ${item.judul}`, 'data');
    Text(`Tahun: ${item.tahun}`, 'data');
    Text(`Dana Disetujui: ${item.dana_disetujui}`, 'data');
    Text("Perguruan Tinggi:", 'info');
    Text(`  Kode Perguruan Tinggi: ${item.perguruan_tinggi.kode_perguruan_tinggi}`, 'data');
    Text(`  Nama Perguruan Tinggi: ${item.perguruan_tinggi.nama_perguruan_tinggi}`, 'data');
    Text("Mahasiswa:", 'info');
    item.mahasiswa.forEach((mahasiswa, idx) => {
      Text(`  Data Mahasiswa ${idx + 1}`, 'info');
      Text(`    Nomor Mahasiswa: ${mahasiswa.nomor_mahasiswa}`, 'data');
      Text(`    Tahun Masuk: ${mahasiswa.tahun_masuk}`, 'data');
      Text(`    Nama: ${mahasiswa.nama}`, 'data');
      Text(`    Peran: ${mahasiswa.peran}`, 'data');
      Text(`    Kode Program Studi: ${mahasiswa.kode_program_studi}`, 'data');
      Text(`    Nama Program Studi: ${mahasiswa.nama_program_studi}`, 'data');
      Text(`    Kode Perguruan Tinggi: ${mahasiswa.kode_perguruan_tinggi}`, 'data');
      Text(`    Nama Perguruan Tinggi: ${mahasiswa.nama_perguruan_tinggi}`, 'data');
    });
    Text("Dosen:", 'info');
    Text(`  NIDN: ${item.dosen.nidn}`, 'data');
    Text(`  Nama: ${item.dosen.nama}`, 'data');
    Text(`  Kode Program Studi: ${item.dosen.kode_program_studi}`, 'data');
    Text(`  Nama Program Studi: ${item.dosen.nama_program_studi}`, 'data');
    Text(`  Kode Perguruan Tinggi: ${item.dosen.kode_perguruan_tinggi}`, 'data');
    Text(`  Nama Perguruan Tinggi: ${item.dosen.nama_perguruan_tinggi}`, 'data');
    Text(`PIMNAS: ${item.is_pimnas ? "Iya" : "Tidak"}`, 'data');
    Text(`Didanai: ${item.is_didanai ? "Iya" : "Tidak"}`, 'data');
    Text("-------------------\n", 'help');
  });

  return res.data
}

export async function CekUser(bearer) {
  const options = Header(bearer, 'GET')
  const res = await axios.get('https://simbelmawa.kemdikbud.go.id/api/user', { headers: options })

  if (res.status !== 200) {
    Text(`[!] ${res.statusText}`, 'error')
    return
  }

  Text('Akun:', 'info')
  Text(`ID: ${res.data.id_personal}`, 'data')
  Text(`Nama: ${res.data.nama_user}`, 'data')
  Text(`Email Verified: ${res.data.is_email_verified ? "Iya" : "Tidak"}`, 'data')
  Text(`Email Token: ${res.data.email_token}`, 'data')
  Text(`Tanggal Email Verified: ${res.data.tgl_email_verified}`, 'data')
  Text(`Reset Password Token: ${res.data.reset_password_token}`, 'data')
  Text(`Tanggal Expired Reset Password: ${res.data.tgl_expired_reset_password}`, 'data')
  Text('Akun Aktif Peran:', 'info')
  res.data.active_perans.forEach((item, index) => {
    Text(`  Data ${index + 1}:`, 'info')
    Text(`  ID: ${item.id_peran}`, 'data')
    Text(`  Nama Peran: ${item.nama_peran}`, 'data')
    Text(`  Keterangan: ${item.keterangan}`, 'data')
    Text(`  Kode Kelompok: ${item.kd_kelompok_peran}`, 'data')
    Text(`  Kode Status Aktif: ${item.kd_sts_aktif}`, 'data')
    Text(`  Laravel Through Key: ${item.laravel_through_key}`, 'data')
  })
  Text('Data Personal:', 'info')
  Text(`ID: ${res.data.personal.id_personal}`, 'data')
  Text(`Nama: ${res.data.personal.nama}`, 'data')
  Text(`Nama Dengan Gelar: ${res.data.personal.nama_gelar}`, 'data')
  Text(`Foto: ${res.data.personal.url_foto_profil}`, 'data')
  Text(`Gelar Akademik Depan: ${res.data.personal.gelar_akademik_depan}`, 'data')
  Text(`Gelar Akademik Belakang: ${res.data.personal.gelar_akademik_belakang}`, 'data')
  Text(`ID Institusi: ${res.data.personal.id_institusi}`, 'data')
  Text(`Facebook: ${res.data.personal.link_facebook}`, 'data')
  Text(`Tiktok: ${res.data.personal.link_tiktok}`, 'data')
  Text(`Instagram: ${res.data.personal.link_instagram}`, 'data')
  Text(`Youtube: ${res.data.personal.link_youtube}`, 'data')
  Text('Identitas: ', 'info')
  Text(`  ID: ${res.data.personal.identitas_pengguna.id_personal}`, 'data')
  Text(`  Nama User: ${res.data.personal.identitas_pengguna.nama_user}`, 'data')
  Text(`  Email Verified: ${res.data.personal.identitas_pengguna.is_email_verified ? "Iya" : "Tidak"}`, 'data')
  Text(`  Email Token: ${res.data.personal.identitas_pengguna.email_token}`, 'data')
  Text(`  Tanggal Email Verified: ${res.data.personal.identitas_pengguna.tgl_email_verified}`, 'data')
  Text(`  Reset Password Token: ${res.data.personal.identitas_pengguna.reset_password_token}`, 'data')
  Text(`  Tanggal Expired Reset Password: ${res.data.personal.identitas_pengguna.tgl_expired_reset_password}`, 'data')
  Text(`Institusi: `, 'info')
  Text(`  ID: ${res.data.personal.institusi.id_institusi}`, 'data')
  Text(`  Nama: ${res.data.personal.institusi.nama_institusi}`, 'data')
  Text(`  Alamat: ${res.data.personal.institusi.alamat}`, 'data')
  Text(`  Telepon: ${res.data.personal.institusi.telepon}`, 'data')
  Text(`  Email: ${res.data.personal.institusi.surel}`, 'data')
  Text(`  Kode Status: ${res.data.personal.institusi.kd_sts_data}`, 'data')

  return res.data
}

export async function JumlahPageLogbookKegiatan(bearer, idUsulanKegiatan) {
  const options = Header(bearer, 'GET')
  const res = await axios.get(`https://simbelmawa.kemdikbud.go.id/api/mahasiswa/logbook-kegiatan/${idUsulanKegiatan}/isi-logbook`, { headers: options })

  if (res.status !== 200) {
    Text(`[!] ${res.statusText}`, 'error')
    return
  }

  return res.data.meta.last_page
}

export async function LogbookKegiatan(bearer, idUsulanKegiatan, halaman = 1, jumlahPage) {
  const options = Header(bearer, 'GET')
  const res = await axios.get(`https://simbelmawa.kemdikbud.go.id/api/mahasiswa/logbook-kegiatan/${idUsulanKegiatan}/isi-logbook?page=${halaman}`, { headers: options })

  if (res.status !== 200) {
    Text(`[!] ${res.statusText}`, 'error')
    return
  }

  const reversedData = res.data.data.reverse();
  const awalData = jumlahPage > 1 ? (halaman < jumlahPage ? (jumlahPage - halaman) * 10 : 0) : 0;

  reversedData.forEach((item, index) => {
    const dataIndex = awalData + index + 1;

    Text(`Data ${dataIndex}:`, 'info');
    Text(`ID: ${item.id_catatan_harian}`, 'data');
    Text(`Tanggal: ${item.tgl_pelaksanaan}`, 'data');
    Text(`Kegiatan: ${item.kegiatan_yg_dilakukan}`, 'data');
    Text(`Menit Pelaksanaan: ${item.menit_pelaksanaan}`, 'data');
    Text(`Persentase Capaian: ${item.persentase_capaian}`, 'data');
    Text(`Status: ${item.status_validasi_dosen}`, 'data');
    Text('Berkas:', 'info');
    item.berkas.forEach((berkas, idx) => {
      Text(`  Data Berkas ${idx + 1}`, 'info');
      Text(`  ID: ${berkas.id_berkas_catatan_harian}`, 'data');
      Text(`  Nama: ${berkas.nama_berkas}`, 'data');
      Text(`  Tipe: ${berkas.tipe_berkas}`, 'data');
      Text(`  Ukuran: ${berkas.ukuran_berkas}`, 'data');
      Text(`  URL: ${berkas.nama_file}`, 'data');
    });
    Text("-------------------\n", 'help');
  });

  return res.data
}

export async function JumlahPageLogbookKeuangan(bearer, idUsulanKegiatan) {
  const options = Header(bearer, 'GET')
  const res = await axios.get(`https://simbelmawa.kemdikbud.go.id/api/mahasiswa/logbook-keuangan/${idUsulanKegiatan}/isi-logbook`, { headers: options })

  if (res.status !== 200) {
    Text(`[!] ${res.statusText}`, 'error')
    return
  }

  return res.data.meta.last_page
}

export async function LogbookKeuangan(bearer, idUsulanKegiatan, halaman = 1, jumlahPage) {
  const options = Header(bearer, 'GET')
  const res = await axios.get(`https://simbelmawa.kemdikbud.go.id/api/mahasiswa/logbook-keuangan/${idUsulanKegiatan}/isi-logbook?page=${halaman}`, { headers: options })

  if (res.status !== 200) {
    Text(`[!] ${res.statusText}`, 'error')
    return
  }

  const reversedData = res.data.data.reverse();
  const awalData = jumlahPage > 1 ? (halaman < jumlahPage ? (jumlahPage - halaman) * 10 : 0) : 0;

  reversedData.forEach((item, index) => {
    const dataIndex = awalData + index + 1;

    Text(`Data ${dataIndex}:`, 'info');
    Text(`ID: ${item.id_catatan_keuangan}`, 'data');
    Text(`Keterangan: ${item.keterangan}`, 'data');
    Text(`Tanggal Transaksi: ${item.tgl_transaksi}`, 'data');
    Text(`Harga Satuan: ${item.harga_satuan}`, 'data');
    Text(`Satuan: ${item.satuan}`, 'data');
    Text(`Jumlah: ${item.jumlah}`, 'data');
    Text(`Total: ${item.total}`, 'data');
    Text(`Jenis Pembelanjaan: ${item.jenis_pembelanjaan}`, 'data');
    Text(`Status: ${item.status_validasi_dosen}`, 'data');
    Text(`Ada Bukti: ${item.is_ada_bukti ? "Iya" : "Tidak"}`, 'data');
    Text('Berkas:', 'info');
    item.berkas.forEach((berkas, idx) => {
      Text(`  Data Berkas ${idx + 1}`, 'info');
      Text(`  ID: ${berkas.id_berkas_catatan_keuangan}`, 'data');
      Text(`  Nama: ${berkas.nama_berkas}`, 'data');
      Text(`  Tipe: ${berkas.tipe_berkas}`, 'data');
      Text(`  Ukuran: ${berkas.ukuran_berkas}`, 'data');
      Text(`  URL: ${berkas.nama_file}`, 'data');
    });
    Text("-------------------\n", 'help');
  });

  return res.data
}
