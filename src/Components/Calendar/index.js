import "./styles.scss";

import React, { useEffect, useState } from "react";

import FormInput from "../FormInput";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { get } from "../../services/RestService";
import { options } from "../../helpers";
// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";
import { useHistory } from "react-router-dom";

// import timeGridPlugin from "@fullcalendar/timegrid";


// import events from "./events";

export default function EventDetail() {
  let history = useHistory();
  const [data, setData] = useState();
  const [dataFilter, setDataFilter] = useState();

  const getData = () => {
    get("/notifications", options)
      .then((data) => {
        const resData = [];
        const notData = data.result;
        notData &&
          notData.map((data, index) =>
            resData.push({
              title: data.title,
              date: data.createdAt.substring(0, 10),
              url: data.type,
            })
          );
        setData(resData);
        setDataFilter(resData);
      })
      .catch((err) => {});
  };

  const searchByName = (name) => {
    if (name !== "") {
      const res = data.filter((sd) => {
        return sd?.title.toString().includes(name);
      });
      setData(res);
    } else {
      setData(dataFilter);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const redirecttNotify = (type) => {
    if (type === "product") {
      history.push("/products");
    }
    if (type === "service") {
      history.push("/services");
    }
    if (type === "promotion") {
      history.push("/offers");
    }
    if (type === "booking") {
      history.push("/jobs");
    }
  };

  return (
    <div className="calender-wrapper">
      <p>Search Events</p>
      <FormInput
        onChange={(e) => {
          searchByName(e.target.value);
        }}
        placeholder="Search By Title"
      />
      <FullCalendar
        defaultView="dayGridMonth"
        dayMaxEventRows={2}
        header={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        plugins={[dayGridPlugin]}
        // plugins={[dayGridPlugin, timeGridPlugin]}
        eventClick={(arg) => {
          arg.jsEvent.preventDefault();
          redirecttNotify(arg.event.url);
        }}
        events={data}
      />
    </div>
  );
}
