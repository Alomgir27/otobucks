import React, { useState, useEffect } from "react";
import { Spin, Divider } from "antd";
import { get } from "../../services/RestService";
import { options } from "../../helpers";
import "./styles.scss";

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  const getData = () => {
    setLoading(true);
    get("/privacy-policy", options)
      .then((data) => {
        let description = data.result.description;
        description = description.replace(/<[^>]+>/g, "");
        let list = description.split(/(?=\d\.)/);
        list.shift();
        list = list.map((item, index) => {
          return item.replace(/\d\./, index + 1 + ".");
        });
        //create a list of li elements
        let listItems = []
        list.map((item, index) => {
           // split the item into an array of lines
            let lines = item.split(/\n/);
            let header = lines.shift();
            // remove last element if it is empty or less 2 characters
            if (lines[lines.length - 1].length < 2) {
                lines.pop();
            }
            let li = [];
            // create a list of li elements
            lines.map((line, index) => {
                li.push(<li className="list_item" key={index}>{line}</li>)
            })
            // create a list of ul elements
            listItems.push(<li className="list_item" key={index}>
                <p className="list_header">{header}</p>
                <ul className="list_header__item">
                    {li}
                </ul>
            </li>)
        });
        setData(listItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return loading ? (
    <div className="loader">
      <Spin />
    </div>
  ) : (
    <div style={{ padding: 30 }}>
      <div style={{ backgroundColor: "white", padding: 20 }}>
        <h1>Privacy Policy</h1>
        <Divider />

        <div style={{ marginTop: 20 }}>
          <ul>{data}</ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
