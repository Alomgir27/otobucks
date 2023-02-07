import "./styles.scss";

import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { DatePicker, Input, Table, Button, Select , Tag } from "antd";
import { EyeFilled } from "@ant-design/icons";
import Grid from "@mui/material/Grid";
import { get, patch } from "../../services/RestService";
import { openNotification, options } from "../../helpers";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const CustomerEstimation = () => {
  const componentRef = useRef();
  const [discount, setDiscount] = useState(0);
  const [createEstimationForm, setCreateEstimationForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estimations, setEstimations] = useState([]);
  const [estimationEditable, setEstimationEditable] = useState(false);
  const [selectedEstimation, setSelectedEstimation] = useState(null);
  const [settingsData, setSettingsData] = useState({});
  const [dataFilter, setDataFilter] = useState([]);
  const [filters, setFilters] = useState({
    service: "",
    status: "All",
    date: ["", ""],
  });
  const [data, setData] = useState([
    {
      title: "",
      description: "",
      quantity: "",
      price: "",
      tax: "",
      amount: "",
    },
  ]);

  const statusValues = [
    "All",
    "submitted",
    "resubmitted",
    "inProgress",
    "declined",
    "completed",
    "cancelled",
  ];

  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const getEstimationRequests = () => {
    setLoading(true);
    get("/estimates", config)
      .then((res) => {
        setEstimations(
          res.result.filter(
            (estimate) =>
              estimate.status !== "pending" &&
              estimate.status !== "completed" &&
              estimate.status !== "cancelled"
          )
        );
        setDataFilter(
          res.result.filter(
            (estimate) =>
              estimate.status !== "pending" &&
              estimate.status !== "completed" &&
              estimate.status !== "cancelled"
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        err?.message && openNotification(err.message);
      });
  };

  const getSettings = () => {
    setLoading(true);
    setData([
      {
        title: "",
        description: "",
        quantity: "",
        price: "",
        tax: "",
        amount: "",
      },
    ])
    setSelectedEstimation(null)
    get("/estimate-setting/", config)
      .then((res) => {
        setSettingsData(res?.result[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    getEstimationRequests();
    getSettings();
  }, []);

  useEffect(() => {
    const filterByService = filters.service
      ? estimations.filter((estimation) => {
          return estimation?.source?.title
            .toString()
            .toLowerCase()
            .includes(filters.service);
        })
      : estimations;
    const filterByStatus =
      filters.status !== "All"
        ? filterByService.filter((estimation) => {
            return estimation.status === filters.status;
          })
        : filterByService;
    const filteredData = filters.date[0]
      ? filterByStatus.filter((estimation) => {
          return (
            estimation?.createdAt.substring(0, 10) >= filters.date[0] &&
            estimation?.createdAt.substring(0, 10) <= filters.date[1]
          );
        })
      : filterByStatus;
    setDataFilter(filteredData);
  }, [filters]);

  const applyFilters = (key, value) => {
    setFilters((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const getSubTotal = () => {
    let total = 0;
    data.forEach((estimation) => {
      total =
        parseFloat(total) +
        parseFloat(estimation.price) * parseFloat(estimation.quantity);
    });
    return total;
  };

  const getFinalTotal = () => {
    let total = 0;
    data.forEach((estimation) => {
      total =
        parseFloat(total) +
          estimation.quantity * estimation.price +
          (estimation.quantity * estimation.price * estimation.tax) / 100 ?? "";
    });
    return total - discount;
  };

  const downloadPdf = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleChange = (index, key1, value1, key2, value2) => {
    const deepCopy = [...data];
    deepCopy[index] = key2
      ? {
          ...deepCopy[index],
          [key1]: value1,
          [key2]: value2,
        }
      : {
          ...deepCopy[index],
          [key1]: value1,
        };
    setData(deepCopy);
  };

  const handleSubmitForm = () => {
    if (data.lenght === 0) {
      openNotification("Please add at least one item");
    } else if (
      isNaN(getSubTotal()) ||
      isNaN(getFinalTotal() - getSubTotal() + parseFloat(discount)) ||
      isNaN(getFinalTotal())
    ) {
      openNotification("Invalid quotation for customer");
    } else {
      let customer_data = {
        items: data,
        status: "resubmitted",
        date: new Date(),
        subTotal: getSubTotal(),
        serviceTax: getFinalTotal() - getSubTotal() + parseFloat(discount),
        grandTotal: getFinalTotal(),
        discount,
      };
      patch(
        `/estimates/send/${selectedEstimation?._id}`,
        customer_data,
        options
      )
        .then(() => {
          openNotification("Estimation resubmitted successfully");
          setCreateEstimationForm(false);
          setEstimationEditable(false);
          setData([
            {
              title: "",
              description: "",
              quantity: "",
              price: "",
              tax: "",
              amount: "",
            },
          ]);
          setDiscount(0);
          getEstimationRequests();
        })
        .catch((error) => {
          openNotification(error.message);
        });
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, dataFilter) => (
        <p>{dataFilter?.createdAt.substring(0, 10)}</p>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (_, dataFilter) => (
        <p>
          {`${dataFilter?.customer?.firstName} ${dataFilter?.customer?.lastName}`}
        </p>
      ),
    },
    {
      title: "Service",
      dataIndex: "Service",
      key: "Service",
      render: (_, dataFilter) => <p>{dataFilter?.source?.title}</p>,
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (_, dataFilter) => <Tag className="status_indicator" color={dataFilter?.status == "completed" ? "green" : dataFilter?.status == "declined" ? "red" : "yellow"}>{dataFilter?.status}</Tag>,
    },
    {
      title: "Time",
      dataIndex: "Time",
      key: "Time",
      render: (_, dataFilter) => <p>{dataFilter?.time}</p>,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, dataFilter) => (
        <div className="action-icons">
          <EyeFilled
            onClick={() => {
              setSelectedEstimation(dataFilter);
              setCreateEstimationForm(true);
              setData(dataFilter?.items ?? data);
              setDiscount(dataFilter?.discount);
            }}
          />
        </div>
      ),
    },
  ];

  return !createEstimationForm ? (
    <div id="users" className="estimations-form-wrapper">
      <div className="users-wrapper">
        <Grid container spacing={1}>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <h1>Estimations</h1>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div className="services-btns">
              <Button onClick={downloadPdf} type="primary">
                Download PDF
              </Button>
            </div>
          </Grid>
        </Grid>

        <div style={{ marginTop: 30 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Status</p>
                <Select
                  placeholder="select status"
                  optionLabelProp="label"
                  className="_search_input"
                  defaultValue={"All"}
                  onChange={(value) => applyFilters("status", value)}
                >
                  {statusValues?.map((status, index) => {
                    return (
                      <Option value={status} label={status} key={index}>
                        <div
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                          className="demo-option-label-item"
                        >
                          <span aria-label={status}>{status}</span>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Service Title</p>
                <Input
                  className="_search_input"
                  onChange={(e) => {
                    applyFilters(
                      "service",
                      e.target.value?.toLocaleLowerCase()
                    );
                  }}
                  placeholder="Search By Service Title"
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={3} sm={12} xs={12}>
              <div>
                <p>Search by Date</p>
                <RangePicker
                  className="_search_input"
                  onChange={(e, d) => {
                    applyFilters("date", d);
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </div>

        <div ref={componentRef}>
          <Table
            loading={loading}
            scroll={{ x: true }}
            columns={columns}
            dataSource={dataFilter}
            pagination={true}
            defaultExpandAllRows={true}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="estimation-main-container">
      <div id="users" className="estimations-form-wrapper">
        <div className="users-wrapper">
          <div className="header-text-container">
            <h1
              className="go-back-btn"
              onClick={() => {
                setCreateEstimationForm(false);
                setEstimationEditable(false);
              }}
            >
              Go back
            </h1>
            <h1>Customer Estimation</h1>
          </div>
          <br />
          <h1>Invoice Title</h1>
          <div className="_purchase__search_main2">
            <Input
              value={settingsData?.invoiceTitle}
              disabled
              placeholder="Enter Customer Name"
              className="_purchase_search_input"
            />
          </div>
          <div>Customer Name</div>
          <div className="_purchase__search_main2">
            <Input
              value={`${selectedEstimation?.customer?.firstName} ${selectedEstimation?.customer?.lastName}`}
              disabled
              placeholder="Enter Customer Name"
              className="_purchase_search_input"
            />
          </div>
        </div>
        <div className="search-btns-container">
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Invoice ID</p>
                <Input
                  readOnly
                  disabled={!estimationEditable}
                  className="_invite_friends_input1"
                  value={selectedEstimation?._id}
                />
              </div>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}></Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                <p>Invoice Date</p>
                <DatePicker
                  disabled
                  defaultValue={moment(new Date())}
                  className="_purchase_search_input1 invoice-date"
                />
              </div>
            </Grid>
          </Grid>

          <div className="ant-table-content">
            <table>
              <thead className="ant-table-thead">
                <tr>
                  <th className="ant-table-cell">Title</th>
                  <th className="ant-table-cell">Description</th>
                  <th className="ant-table-cell">Quantity</th>
                  <th className="ant-table-cell">Price</th>
                  <th className="ant-table-cell">Tax (%)</th>
                  <th className="ant-table-cell">Amount</th>
                  <th className="ant-table-cell" />
                </tr>
              </thead>
              <tbody className="ant-table-tbody" id="table_id">
                {data.map((estimation, index) => {
                  return (
                    <tr className="row_class">
                      <td scope="row" id={index} className="title-input-field">
                        <input
                          type="text"
                          disabled={!estimationEditable}
                          value={selectedEstimation.source?.title}
                          placeholder="Please enter title"
                          className="txt-input cleanbtn"
                        />
                      </td>
                      <td className="description-input-field">
                        <input
                          type="text"
                          disabled={!estimationEditable}
                          value={selectedEstimation.source?.description}
                          placeholder="Please enter description"
                          className="txt-input cleanbtn"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          disabled={!estimationEditable}
                          placeholder="Quantity"
                          value={estimation.quantity}
                          pattern="[0-9]*"
                          onChange={(event) =>
                            handleChange(
                              index,
                              "quantity",
                              event.target.value,
                              "amount",
                              event.target.value * estimation.price +
                                (event.target.value *
                                  estimation.price *
                                  estimation.tax) /
                                  100 ?? ""
                            )
                          }
                          className="txt-input cleanbtn"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          disabled={!estimationEditable}
                          placeholder="Price"
                          value={estimation.price}
                          onChange={(event) =>
                            handleChange(
                              index,
                              "price",
                              event.target.value,
                              "amount",
                              estimation.quantity * event.target.value +
                                (estimation.quantity *
                                  event.target.value *
                                  estimation.tax) /
                                  100 ?? ""
                            )
                          }
                          className="txt-input cleanbtn"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          disabled={!estimationEditable}
                          placeholder="Tax"
                          value={estimation.tax}
                          onChange={(event) =>
                            handleChange(
                              index,
                              "tax",
                              event.target.value,
                              "amount",
                              estimation.quantity * estimation.price +
                                (estimation.quantity *
                                  estimation.price *
                                  event.target.value) /
                                  100 ?? ""
                            )
                          }
                          className="txt-input cleanbtn"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          disabled={!estimationEditable}
                          value={estimation.amount}
                          placeholder="Final Amount"
                          className="txt-input cleanbtn"
                        />
                      </td>
                      <td>
                        <Button
                          type="primary"
                          className="save-submit"
                          htmlType="submit"
                          disabled={!estimationEditable}
                          onClick={() => {
                            const deepCopy = [...data];
                            deepCopy.splice(index, 1);
                            setData(deepCopy);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="ant-table-tbody">
                <tr>
                  <td colspan="7">
                    <Button
                      type="primary"
                      disabled={!estimationEditable}
                      className="save-submit"
                      htmlType="submit"
                      onClick={() =>
                        setData((prev) => [
                          ...prev,
                          {
                            title: selectedEstimation.source?.title,
                            description: selectedEstimation.source?.description,
                            quantity: "",
                            price: "",
                            tax: "",
                            amount: "",
                          },
                        ])
                      }
                    >
                      + Add Another Line
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="wrapperSubtotal">
              <table className="margin-table">
                <tbody className="ant-table-tbody ant-table-tbody2">
                  <tr>
                    <td>Sub Total</td>
                    <td className="second">{getSubTotal()}</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td className="second">
                      <input
                        type="text"
                        disabled={!estimationEditable}
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="txt-input cleanbtn discount-btn"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Service Tax</td>
                    <td className="second">
                      {(
                        Math.round(
                          (getFinalTotal() -
                            getSubTotal() +
                            parseFloat(discount)) *
                            100
                        ) / 100
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td className="second">{getFinalTotal()}</td>
                  </tr>
                </tbody>
                {selectedEstimation.status !== "declined" && (
                  <tfoot>
                    <tr>
                      <td colspan="2" className="save-submit">
                        <Button
                          type="primary"
                          className="save-submit"
                          onClick={() =>
                            estimationEditable
                              ? handleSubmitForm()
                              : setEstimationEditable(true)
                          }
                          htmlType="submit"
                        >
                          {!estimationEditable
                            ? "Edit"
                            : selectedEstimation.status === "submitted" ||
                              selectedEstimation.status === "resubmitted"
                            ? "Save & Resubmit"
                            : "Save and Submit"}
                        </Button>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
          <div className="mb300"></div>
        </div>
      </div>
      <div className="bottom-container">
        <img src={settingsData?.logoImage} className="settings-image" alt="" />
        <div>
          <b>Website</b> : {settingsData?.website}
        </div>
      </div>
    </div>
  );
};

export default CustomerEstimation;
