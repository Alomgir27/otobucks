import React, { useState, useEffect } from "react";
import { Spin, Divider } from "antd";
import { get } from "../../services/RestService";
import { options } from "../../helpers";
import "./styles.scss";

const TermsCondition = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  const getData = () => {
    setLoading(true);
    get("/term-condition", options)
      .then((data) => {
        let description = data.result.description;
        description = description.replace(/<[^>]+>/g, "");
        let list = description.split(/\n/);
        list = list.map((item) => item.replace(/\n/g, "\u00A0"));
        list = list.map((item) => item + "\u00A0");
        let listItems = [] 
        for(let i = 0; i < list.length; i++){
          if(i <= 3){
            listItems.push(<li className="list_item" key={i}>{list[i]}</li>)
          }
          else if(list[i][0].match(/\d/)){
            listItems.push(
            <li className="list_item" key={i}>
              <p  className="list_header">{list[i]}</p>
              <ul className="list_header__item">
                <li className="list_item">{list[i+1]}</li>
              </ul>
            </li>)
            i++;
          }
          else{
            listItems.push(<li className="list_header__item" key={i}>{list[i]}</li>)
          }
        }
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
        <h1>Terms And Condition</h1>
        <Divider />

        <div style={{ marginTop: 20 }}>
          <ul>{data}</ul>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
