import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Switch, Image, Select } from "antd";
import UploadImage from "../../Components/UploadImage";
import FormInput from "../../Components/FormInput";
import SelectBox from "../../Components/SelectBox";
import { countries } from "../../constants";
import { post, patch, get } from "../../services/RestService";
import { openNotification, useQueryParams, options } from "../../helpers";
import { useHistory } from "react-router";
import { useMediaQuery } from "react-responsive";
import FormTextarea from "../../Components/FormTextarea";

const { Option } = Select;

const ProductForm = () => {
  const [image, setImage] = useState();
  const [imagePath, setImagePath] = useState();
  const history = useHistory();
  const query = useQueryParams();
  const [userData, setUserData] = useState();
  const method = query.get("type");
  const id = query.get("id");
  const edit = method === "edit";
  const view = method === "view";
  const create = method === "create";
  const [initialValues, setInitialValue] = useState();
  const isMobileScreen = useMediaQuery({ query: "(max-width: 680px)" });
  const [cat, setCat] = useState([]);
  const [categories, setCategories] = useState([{ value: "", title: "" }]);
  const [subCategories, setSubCategories] = useState([]);
  const [isCat, setIsCat] = useState();
  const [isCar, setIsModel] = useState();
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [locations, setLocation] = useState([
    { country: "", address: "", state: "", area: "" },
  ]);
  const [type, setType] = useState();
  const [form] = Form.useForm();

  // handle location input change
  const handleInputChange = (e, name, index) => {
    const value = e;
    const list = [...locations];
    list[index][name] = value;
    setLocation(list);
  };

  //handle location click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...locations];
    list.splice(index, 1);
    setLocation(list);
  };

  //handle location click event of the Add button
  const handleAddClick = () => {
    setLocation([
      ...locations,
      { country: "", address: "", state: "", area: "" },
    ]);
  };

  useEffect(() => {
    get("/categories/getCategories?type=product", options)
      .then((data) => {
        setCat(data?.result);
        const cdata = [];
        data?.result?.map((d) =>
          cdata.push({
            value: d?.slug,
            title: `${d?.title}`,
          })
        );
        setCategories(cdata);
      })
      .catch((err) => {});
    getMakes();
  }, []);

  const getSubCategories = (slug) => {
    setType(slug);
    const { _id } = cat.find((data) => data.slug === slug);
    get(`/categories/getSubCategories/${_id}`, options)
      .then((data) => {
        const cdata = [];
        data?.result?.map((d) =>
          cdata.push({
            value: d?.slug,
            title: `${d?.title}`,
          })
        );
        setSubCategories(cdata);
      })
      .catch((err) => {});
  };

  const getMakes = () => {
    get("/cars/makes", options)
      .then((res) => {
        setMakes(res?.data?.result);
      })
      .catch((err) => {});
  };

  const getModels = (id) => {
    get(`/cars/models?make_id=${id.key}`, options)
      .then((res) => {
        setModels(res?.data?.result);
      })
      .catch((err) => {});
  };

  const onSubmit = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append("image", image);
    formData.append("locations", JSON.stringify(locations));
    formData.append("sub-category", values.subcategory);

    post("/products", formData, options)
      .then((res) => {
        if (res.status === "success") {
          openNotification(res.message);
          history.push("products");
        } else {
          res?.error && openNotification(res.message);
        }
      })
      .catch((err) => {
        err?.message && openNotification(err.message);
      });
  };

  const getData = () => {
    get(`/products/${id}`, options)
      .then((res) => {
        setUserData(res.result);
        const resData = res.result;
        const resDetails = res.result.details;
        setInitialValue({
          stockQty: resData?.inStock,
          brand: resData?.brand,
          p_id: resData.p_id,
          category: resData?.category,
          price: resDetails?.price,
          description: resDetails?.description,
          vendor: resData?.vendor._id,
          title: resData?.title,
          make: resDetails?.make,
          year: resDetails?.year,
          model: resDetails?.model,
          bodyType: resDetails?.bodyType,
          fuelType: resDetails?.fuelType,
          color: resDetails?.color,
          milage: resDetails?.milage,
          seats: resDetails?.seats,
          transmission: resDetails?.transmission,
        });
        setImagePath(res.result?.details?.image);
        setLocation(res.result?.details?.locations);
        setType(res.result?.category);
        if (resDetails.model) {
          setIsModel(true);
        }
        if (res.result?.subcategory) {
          setIsCat(true);
          getSubCategories(res.result?.category);
          form.setFieldsValue({ subcategory: res.result?.subcategory });
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (edit || view) getData();
  }, [edit, view]);

  const onEdit = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append("details.description", values.description);
    formData.append("details.image", image ? image : imagePath);
    formData.append("details.locations", JSON.stringify(locations));
    formData.append("details.price", values.price);
    formData.append("details.stockQty", values.stockQty);
    if (type === "cars") {
      formData.append("details.make", values.make);
      formData.append("details.model", values.model);
      formData.append("details.year", values.year);
      formData.append("details.bodyType", values.bodyType);
      formData.append("details.fuelType", values.fuelType);
      formData.append("details.transmission", values.transmission);
      formData.append("details.color", values.color);
      formData.append("details.milage", values.milage);
      formData.append("details.seats", values.seats);
    }

    patch(`/products/${id}`, formData, options)
      .then((res) => {
        if (res.status) {
          openNotification(res.message);
          history.push("products");
        } else {
          res?.error && openNotification(res.message);
        }
      })
      .catch((err) => {
        err?.message && openNotification(err.message);
      });
  };

  return (
    <div style={{ padding: isMobileScreen ? 10 : 50 }}>
      <div style={{ backgroundColor: "white", padding: 20 }}>
        <h1>
          <span
            style={{ marginRight: 5, cursor: "pointer" }}
            onClick={() => history.push("/products")}
          >
            Products /
          </span>
          {edit ? "Edit" : view ? "View" : "Create"} Product
        </h1>

        {((edit && userData && initialValues) ||
          (view && userData && initialValues) ||
          create) && (
          <div style={{ marginTop: 20 }}>
            <Form
              scrollToFirstError
              form={form}
              onFinish={edit ? onEdit : onSubmit}
              initialValues={initialValues}
            >
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  {(image || imagePath) && (
                    <Image
                      src={image ? URL.createObjectURL(image) : imagePath}
                      style={{ width: 100, height: 100, objectFit: "contain" }}
                    />
                  )}
                  {!view && (
                    <div style={{ marginTop: 20, marginBottom: 10 }}>
                      <p>Upload Product Image</p>
                      <UploadImage image={image} setImage={setImage} />
                    </div>
                  )}

                  <Row gutter={[10, 10]}>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                      <p>Title</p>
                      <FormInput name="title" />
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                      <p>Categories</p>
                      <SelectBox
                        onChange={(e) => getSubCategories(e)}
                        data={categories}
                        name="category"
                      />
                    </Col>
                    {((subCategories && subCategories.length > 0) || isCat) && (
                      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <p>Sub Categories</p>
                        <SelectBox data={subCategories} name="subcategory" />
                      </Col>
                    )}
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                      <p>Price</p>
                      <FormInput name="price" type="number" />
                    </Col>
                  </Row>

                  {type === "cars" && (
                    <>
                      <Row gutter={[10, 10]}>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Makes</p>
                          <Form.Item name="make">
                            <Select
                              style={{ borderRadius: 10, width: "100%" }}
                              defaultValue={"Select"}
                              onChange={(e, d) => getModels(d)}
                            >
                              {makes &&
                                makes.length > 0 &&
                                makes.map((d, i) => (
                                  <Option key={d.make_id} value={d.name}>
                                    {d.name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        {((models && models.length > 0) || isCar) && (
                          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <p>Models</p>
                            <Form.Item name="model">
                              <Select
                                style={{ borderRadius: 10, width: "100%" }}
                                defaultValue={"Select"}
                              >
                                {models &&
                                  models.length > 0 &&
                                  models.map((d, i) => (
                                    <Option key={i} value={d.name}>
                                      {d.name}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        )}
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Year</p>
                          <FormInput name="year" />
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Body Type</p>
                          <FormInput name="bodyType" />
                        </Col>
                      </Row>

                      <Row gutter={[10, 10]}>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Transmission</p>
                          <FormInput name="transmission" />
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Fuel Type</p>
                          <FormInput name="fuelType" />
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Color</p>
                          <FormInput name="color" />
                        </Col>
                      </Row>
                      <Row gutter={[10, 10]}>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Milage</p>
                          <FormInput name="milage" />
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                          <p>Seats</p>
                          <FormInput name="seats" />
                        </Col>
                      </Row>
                    </>
                  )}

                  <Row gutter={[10, 10]}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <p>P_Id</p>
                      <FormInput name="p_id" />
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <p>Brand</p>
                      <FormInput name="brand" />
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <p>Stock Quantity</p>
                      <FormInput name="stockQty" type="number" />
                    </Col>
                  </Row>

                  <div>
                    <p>Description</p>
                    <FormTextarea name="description" />
                  </div>
                </Col>
              </Row>

              {locations.length > 0 &&
                locations.map((loc, index) => (
                  <>
                    <Row gutter={[10, 10]}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <p>Country</p>
                        <SelectBox
                          onChange={(e) => {
                            handleInputChange(e, "country", index);
                          }}
                          country
                          value={loc.country}
                          data={countries}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <p>Address</p>
                        <FormInput
                          onChange={(e) =>
                            handleInputChange(e.target.value, "address", index)
                          }
                          value={loc.address}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <p>Region</p>
                        <FormInput
                          onChange={(e) =>
                            handleInputChange(e.target.value, "state", index)
                          }
                          value={loc.state}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <p>Area</p>
                        <FormInput
                          onChange={(e) =>
                            handleInputChange(e.target.value, "area", index)
                          }
                          value={loc.area}
                        />
                      </Col>
                    </Row>
                    {!view && (
                      <Row style={{ marginBottom: 10 }} gutter={[10, 10]}>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          <Button
                            onClick={() => handleRemoveClick(index)}
                            type="primary"
                            htmlType="button"
                          >
                            Remove location
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </>
                ))}

              {!view && (
                <Row gutter={[10, 10]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Button
                      onClick={() => handleAddClick()}
                      type="primary"
                      htmlType="button"
                    >
                      Add location
                    </Button>
                  </Col>
                </Row>
              )}

              {!view && (
                <Button
                  style={{ marginTop: 30 }}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              )}
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
