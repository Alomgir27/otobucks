import { useEffect, Fragment, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Upload,
  Image,
  Radio,
} from "antd";
import Logo from "../../assets/autofix.png";
import { useHistory } from "react-router";
import { countries } from "../../constants";
import "./styles.scss";
import SelectBox from "../../Components/SelectBox";
import { client, s3Client } from "../../constants";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import { post, patch } from "../../services/RestService";
import { openNotification, useQueryParams } from "../../helpers";
import { Country, State, City } from "country-state-city";
const { Option } = Select;

const FormItem = Form.Item;

const dummyRequest = ({ _, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const beforeUpload = (file) => {
  return true;
};

const Register = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [distributor, setDistributor] = useState("");
  const [states, setState] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [phone, setPhone] = useState("");
  const [pCode, setPCode] = useState("+971");
  const [vType, setVType] = useState("company");
  const [pImage, setImage] = useState("");
  const [logo, setLogo] = useState("");
  const [tradeLicence, setTradeLicence] = useState("");
  const [trnCertificate, setTrnCertificate] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emirate, setEmirate] = useState();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(true);
  const query = useQueryParams();
  const isVerify = query.get("email");
  const history = useHistory();

  const onFinish = (values) => {
    const email = values.email;
    const data = { ...values };
    data.phone = pCode + values.phone;
    data.states = selectedState;
    data.states = selectedState;
    data.cities = selectedCities;
    data.role = "productSeller";
    data.providerType = "company";
    if (vType === "company") {
      data.image = pImage?.image;
      data.logo = logo?.image;
      data.tradeLicence = tradeLicence;
      data.trnCertificate = trnCertificate;
    }
    post("/auth/providers/register", data)
      .then((res) => {
        if (res.status === "success") {
          openNotification(
            "Thank you for creating the product, you will be notified once the admin approves the product."
          );
          sendCode(email);
        }
      })
      .catch((err) => {
        let message = "";
        if (
          err.error &&
          err.error.errors &&
          err.error.errors[0] &&
          err.error.errors[0].msg
        ) {
          message = err.error.errors[0].msg;
        }
        if (err.message) {
          message = err.message;
        }
        openNotification(message);
      });
  };

  const onFinishFailed = (errorInfo) => {};

  const Distributor = [
    { value: "countryDistributor", title: "countryDistributor" },
    { value: "stateDistributor", title: "atateDistributor" },
    { value: "cityDistributor", title: "cityDistributor" },
  ];

  const setCode = (e) => {
    const code = countries.find((x) => x.value === e);
    setPCode(code?.phoneCode);
    const state = State.getStatesOfCountry(code.code);
    setSelectedState([]);
    setSelectedCities([]);
    setCities([]);
    setState(state);
  };

  // ? Category MultiSelect Handler
  function handleChange(value) {}

  // ? State MultiSelect Handler
  function handleStateChange(value) {
    setSelectedState(value);
    const cities = [];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < states.length; j++) {
        if (value[i] === states[j].name) {
          const city = City.getCitiesOfState(
            states[j].countryCode,
            states[j].isoCode
          );
          cities.push(...city);
        }
      }
    }
    setCities(cities);
  }

  const scanHandler = async (e, setFile) => {
    try {
      setLoading(true);
      let imageName = e.file.name;
      const options = {
        Key: imageName,
        Bucket: "cdn.carbucks.com",
        Body: e.file.originFileObj,
      };

      const imageData = await s3Client.send(new PutObjectCommand(options));

      const params = {
        Document: {
          S3Object: {
            Bucket: "cdn.carbucks.com",
            Name: imageName,
          },
        },
        FeatureTypes: ["TABLES"],
      };

      const detectDocumentTextCommand = new DetectDocumentTextCommand(params);
      const data = await client.send(detectDocumentTextCommand);

      let text = "";
      data?.Blocks?.map((block) => {
        if (block.BlockType === "LINE") {
          if (text !== "") text = `${text}\n${block.Text}`;
          else text = `${block.Text}`;
        }
      });

      let s3ImageLink = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;

      setFile({ image: s3ImageLink, text: text });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  function handleCityChanges(value) {
    setSelectedCities(value);
  }

  const sendCode = (email) => {
    const data = {
      email,
    };

    patch("/auth/users/send-email-verification-token", data)
      .then((res) => {
        if (res.status === "success") {
          openNotification(res.message);
          history.push(`/register?email=${email}`);
        }
      })
      .catch((err) => {
        openNotification(err.message);
      });
  };
  return (
    <div id="register">
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>First Name</p>
            <FormItem
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              rules={[{ required: true, message: "Required" }]}
              hasFeedback
            >
              <Input placeholder={"First Name"} />
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Last Name</p>
            <FormItem
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              rules={[{ required: true, message: "Required" }]}
              hasFeedback
            >
              <Input placeholder={"Last Name"} />
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Email</p>
            <FormItem
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              rules={[{ type: "email", required: true, message: "Required" }]}
              hasFeedback
            >
              <Input placeholder={"E-mail"} />
            </FormItem>
          </Col>
          {vType === "company" && (
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <p>Company Name</p>
              <FormItem
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                rules={[{ required: true, message: "Required" }]}
                hasFeedback
              >
                <Input placeholder={"Company Name"} />
              </FormItem>
            </Col>
          )}
          {/* <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Product Category</p>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select services"
              onChange={handleChange}
              optionLabelProp="label"
            >
              <Option value="Drop" label="Drop">
                <div className="demo-option-label-item">
                  <span role="img" aria-label="Drop">
                    💧
                  </span>
                  Drop
                </div>
              </Option>
            </Select>
          </Col> */}
        </Row>
        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <p>Activity</p>
            <SelectBox
              country
              data={Distributor}
              placeholder={"Distributor"}
              name="distributor"
              onChange={(e) => setDistributor(e)}
              rules={[{ required: true, message: "Required" }]}
              hasFeedback
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Country</p>
            <SelectBox
              country
              data={countries}
              placeholder={"Country"}
              name="country"
              onChange={(e) => setCode(e)}
              rules={[{ required: true, message: "Required" }]}
              hasFeedback
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>State</p>

            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="select states"
              rules={[{ required: true, message: "Required" }]}
              onChange={handleStateChange}
              value={selectedState}
              optionLabelProp="label"
            >
              {states.map((state, index) => {
                return (
                  <Option value={state.name} label={state.name} key={index}>
                    <div className="demo-option-label-item">
                      <span aria-label={state.name}>{state.name}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Cities</p>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="select cities"
              rules={[{ required: true, message: "Required" }]}
              onChange={handleCityChanges}
              value={selectedCities}
              optionLabelProp="label"
            >
              {cities.map((city, index) => {
                return (
                  <Option value={city.name} label={city.name} key={index}>
                    <div className="demo-option-label-item">
                      <span aria-label={city.name}>{city.name}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Phone No</p>
            <FormItem
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              rules={[{ required: true, message: "Required" }]}
              hasFeedback
            >
              <Input addonBefore={pCode} placeholder={"Phone"} />
            </FormItem>
          </Col>
        </Row>
        {vType === "company" && (
          <>
            <p>Documents</p>
            <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {pImage?.image && (
                    <Image
                      src={pImage?.image}
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                  <Upload
                    dummyRequest={dummyRequest}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={(e) => scanHandler(e, setImage)}
                  >
                    <Button loading={loading}>Upload your Image</Button>
                  </Upload>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {logo?.image && (
                    <Image
                      src={logo?.image}
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                  <Upload
                    dummyRequest={dummyRequest}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={(e) => scanHandler(e, setLogo)}
                  >
                    <Button loading={loading}>Upload Logo</Button>
                  </Upload>
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {tradeLicence?.image && (
                    <Image
                      src={tradeLicence?.image}
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                  <p>{tradeLicence?.text}</p>
                  <Upload
                    dummyRequest={dummyRequest}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={(e) => scanHandler(e, setTradeLicence)}
                  >
                    <Button loading={loading}>Upload Trade Licence</Button>
                  </Upload>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {trnCertificate?.image && (
                    <Image
                      src={trnCertificate?.image}
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                  <p>{trnCertificate?.text}</p>
                  <Upload
                    dummyRequest={dummyRequest}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={(e) => scanHandler(e, setTrnCertificate)}
                  >
                    <Button loading={loading}>Upload Trn Certificate</Button>
                  </Upload>
                </div>
              </Col>
            </Row>
          </>
        )}
        <Row style={{ marginTop: 10 }} gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Password</p>
            <Form.Item
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <p>Confirm Password</p>
            <Form.Item
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords you entered do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Button
            type="primary"
            htmlType="submit"
            //loading={loading.effects.login}
          >
            Register
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default Register;
