import { useLocation } from 'react-router';
import { notification } from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';

export const logout = (history) => {
  localStorage.clear();
  //history && history.push('/')
  window.location.reload();
};

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

export const openNotification = (text) => {
  notification.open({
    message: text,
    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
  });
};
export const openErrorNotification = (text) => {
  notification.open({
    message: text,
    icon: <FrownOutlined style={{ color: '#e91010' }} />,
  });
};

export const CHART_TYPES = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'doughnut', label: 'Doughnut' },
  { value: 'pie', label: 'Pie' },
  { value: 'polar', label: 'Polar' },
];
export const CHART_OPTIONS = {
  scales: { yAxes: [{ ticks: { beginAtZero: true, precision: 0 } }] },
};
export const CHART_DATASET_OPTIONS = {
  backgroundColor: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 232, 1)',
    'rgba(54, 162, 135, 1)',
    'rgba(255, 206, 186, 1)',
    'rgba(75, 192, 12, 1)',
    'rgba(153, 202, 55, 1)',
    'rgba(25, 159, 64, 1)',
  ],
  borderColor: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 32, 1)',
    'rgba(54, 162, 35, 1)',
    'rgba(255, 206, 186, 1)',
    'rgba(75, 292, 192, 1)',
    'rgba(153, 202, 255, 1)',
    'rgba(255, 259, 64, 1)',
  ],
  borderWidth: 1,
  barThickness: 30,
};

const t = localStorage.getItem('token');
const token = `Bearer ${t}`;
export const options = {
  headers: {
    Authorization: token,
  },
};

export const downloadExcelFile = (data, title) => {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'students');
  // Generate buffer
  XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });
  // Binary string
  XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' });
  XLSX.writeFile(workBook, `${title}.xlsx`);
};
