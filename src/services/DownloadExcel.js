import * as XLSX from 'xlsx';

function DownloadExcel(jsonData, sheet, book) {
  console.log(JSON.parse(jsonData));
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(JSON.parse(jsonData));
  XLSX.utils.book_append_sheet(wb, ws, sheet);
  XLSX.writeFile(wb, `${book + new Date()}.xlsx`);
}

export default DownloadExcel;
