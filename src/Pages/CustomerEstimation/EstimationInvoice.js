import './styles.scss';

import React, { useEffect, useState } from "react";
import { deleteService, get, patch } from "../../services/RestService";
import { openNotification, options } from "../../helpers";

import Select from "@mui/material/Select";
import SelectBox from "../../Components/SelectBox";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const EstimationInvoice = () => {

  const ExportOptions = [
    { value: "Duplicate", title: "Duplicate" },
    { value: "Export As PDF", title: "Export As PDF" },
    { value: "Print", title: "Print" },
  ];

  return (
    <div id="users" style={{ padding: 30 }}>
      <div className="users-wrapper">
        <div className='users-wrapper-2'>
          <h1>
            <span className='customer-estimation'>Customer Estimation</span>
            <br />
            <h6>Tax Invoice</h6>
          </h1>
          <div className='export-dropdown'>
            <SelectBox
              data={ExportOptions}
              placeholder={"ExportOptions"}
              name="ExportOptions"
            />
          </div>
        </div>
      </div>

      <div className="ant-table-content">
        <table>
          <thead className="ant-table-thead">
            <tr>
              <th className="ant-table-cell h50"></th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="ant-table-content">
        <div className='customer-wrap-content'>
          <div className='customer-left-content'>
            <div><b>Customer Name :</b> Mayank Patel</div>
            <div className='customer-description'><b>Description : </b><br />Duis odio neque, pretium a massa eget, consectetur venenatis nisl. In sollicitudin tempus quam, quis dignissim ex eleifend eu.</div>
          </div>
          <div className='customer-right-content'>
            <div><b>Invoice ID:</b> #12345</div>
            <div><b>Invoice Date :</b> 20/12/2022</div>
          </div>
        </div>
      </div>

      <div className="ant-table-content">
        <table>
          <thead className="ant-table-thead">
            <tr>
              <th className="ant-table-cell">Title</th>
              <th className="ant-table-cell">Description</th>
              <th className="ant-table-cell">Quantity</th>
              <th className="ant-table-cell">Price</th>
              <th className="ant-table-cell">Tax</th>
              <th className="ant-table-cell">Amount</th>
            </tr>
          </thead>
          <tbody className='ant-table-tbody'>
            <tr>
              <td>Title 1</td>
              <td>Description 1</td>
              <td>100</td>
              <td>100</td>
              <td>20</td>
              <td>10020</td>
            </tr>
            <tr>
              <td>Title 2</td>
              <td>Description 2</td>
              <td>200</td>
              <td>200</td>
              <td>20</td>
              <td>40020</td>
            </tr>
          </tbody>
        </table>
        <div className="wrapperSubtotal">
          <table className='margin-table'>
            <tbody className='ant-table-tbody ant-table-tbody2'>
              <tr>
                <td>Sub Total</td>
                <td className='second'>50040</td>
              </tr>
              <tr>
                <td>Discount (10%)</td>
                <td className='second'>-10</td>
              </tr>
              <tr>
                <td>Service Tax (5%)</td>
                <td className='second'>-10</td>
              </tr>

            </tbody>
            <tfoot className="ant-table-thead">
              <tr>
                <th>Total</th>
                <th className='third'>50020</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="search-btns-container">
        <div className='mb300'></div>
      </div>
      <div className="ant-table-content">
        <div className='three-col-wrap'>
          <div className='three-col-left'>
            <img src="https://otobucks.com/static/media/logo.6ee54a9994aedac9fb75.png" alt="Oto Bucks" /></div>
          <div className='three-col-middle'>
            <b>OtoBucks</b><br />
            <div>David Anderson</div>
            <div>United Arab Emirates</div>
          </div>
          <div className='three-col-last'>
            <b>Contact Information</b>
            <div>Mobile : (+971)1234567890</div>
            <div>www.otobucks.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationInvoice;