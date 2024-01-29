import ExcelJS from 'exceljs';
import { Document, Table, TableCell, TableRow, Paragraph, ImageRun, HeadingLevel, Packer, SectionType } from 'docx';
import fs from 'fs';
import fse from 'fs-extra';
import { momentDate } from './utils.js';
import { Text } from './config.js';
import axios from 'axios';
import sizeOf from 'image-size';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function DownloadLogbookKeuangan(kegiatan, data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  const headers = ['ID Keuangan', 'ID Kegiatan', 'Keterangan', 'Harga Satuan', 'Satuan', 'Jumlah', 'Total', 'Jenis Pembelanjaan', 'Validasi Dosen', 'Ada Bukti', 'Tanggal Transaksi', 'Berkas', 'Links'];
  worksheet.addRow(headers);

  const columnWidths = headers.map((header) => header.length);
  data.forEach((item) => {
    const row = Object.values(item);
    const berkasData = item.berkas.map((berkasItem) => `${berkasItem.nama_berkas}: ${berkasItem.nama_file}`);
    row.push(berkasData.join('\n'));
    const worksheetRow = worksheet.addRow(row);

    worksheetRow.eachCell((cell, colNumber) => {
      const column = worksheet.getColumn(colNumber);
      column.width = columnWidths[colNumber] + 2;

      if (colNumber == 12) {
        cell.alignment = { wrapText: true };
        column.width = 40;
      } else {
        cell.alignment = { vertical: 'top' };
      }

      if (colNumber === 4 || colNumber === 7) {
        cell.value = Number(cell.value);
      }
    });
  });


  const fileName = `${kegiatan}-PKM-Logbook-Keuangan.xlsx`;
  await workbook.xlsx.writeFile(fileName);
  Text(`File Excel "${fileName}" berhasil dibuat.`, 'success');
}

export async function DownloadLogbookKegiatan(kegiatan, data) {
  try {
    const folderPath = `${kegiatan.id_usulan_kegiatan}-kegiatan`;
    if (await fse.pathExists(folderPath)) {
      await fse.remove(folderPath);
    }
    await fse.mkdir(folderPath);

    const typeImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const rowsTable = [];

    for (const item of data) {
      Text(`[+] Progress ${item.kegiatan_yg_dilakukan}`, 'info');

      const berkasCell = [];

      for (const berkas of item.berkas) {
        Text(`[+] Download berkas ${berkas.nama_berkas}`, 'info');

        if (typeImage.includes(berkas.tipe_berkas.toLowerCase())) {
          const filePath = `./${folderPath}/${berkas.id_berkas_catatan_harian}-${berkas.nama_berkas}.${berkas.tipe_berkas}`;
          await downloadImage(berkas.nama_file, filePath);

          try {
            const imageSize = sizeOf(filePath);

            const image = new Paragraph({
              children: [
                new ImageRun({
                  data: await fs.promises.readFile(filePath),
                  transformation: {
                    width: imageSize.width ? imageSize.width * 0.5 : 100,
                    height: imageSize.height ? imageSize.height * 0.5 : 100,
                  },
                }),
              ],
            });

            berkasCell.push(image);
          } catch (error) {
            console.error(`Error reading image file: ${filePath}`);
            console.error(error);

            const corruptedImage = new Paragraph({
              text: 'Corrupt Image: ' + berkas.nama_file,
            });

            berkasCell.push(corruptedImage);
          }
        } else {
          berkasCell.push(
            new Paragraph({
              text: berkas.nama_file,
            })
          );
        }
      }

      const rowChildren = new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: momentDate(item.tgl_pelaksanaan),
              })
            ]
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: item.kegiatan_yg_dilakukan.trim(),
              })
            ]
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: `${item.menit_pelaksanaan}`,
              })
            ]
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: `${item.persentase_capaian}%`,
              })
            ]
          }),
          new TableCell({
            children: berkasCell
          }),
        ],
      });

      rowsTable.push(rowChildren);
    }

    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Tanggal Kegiatan',
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Kegiatan'
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Menit Pelaksanaan'
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Persentase Capaian'
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Bukti Kegiatan'
                })
              ]
            })
          ],
          tableHeader: true
        }),
        ...rowsTable
      ],
      width: {
        size: 100,
        type: 'pct'
      },
    });

    const doc = new Document({
      sections: [{
        properties: {
          type: SectionType.CONTINUOUS,
        },
        children: [
          new Paragraph({
            text: kegiatan.judul,
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
          }),
          new Paragraph({
            text: `${kegiatan.nama_skema} Tahun ${kegiatan.tahun}`,
            heading: HeadingLevel.HEADING_3,
            alignment: 'center',
          }),
          table
        ]
      }]
    })

    const fileName = `${kegiatan.id_usulan_kegiatan}-PKM-Logbook-Kegiatan.docx`;
    const dataBuffer = await Packer.toBuffer(doc);
    fs.writeFileSync(fileName, dataBuffer);
    console.log(`File Word "${fileName}" berhasil dibuat.`);
  } catch (error) {
    Text(`[!] ${error.message}`, 'error');
  }
}

async function downloadImage (url, filename) {
  const writer = fs.createWriteStream(filename)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
