import React, { useState, useEffect } from "react";
import { CloseIcon, DropDownIcon } from "../../Icons";

const AddRecommendation = ({ setOpen5 }) => {
  const [searchPeople, setSearchPeople] = useState();
  const [hide, setHide] = useState(false);
  const [hide2, setHide2] = useState(false);
  const [hide3, setHide3] = useState(false);
  const [selectedState, setSelectedState] = useState();
  const [selectedState2, setSelectedState2] = useState();
  const [selectedState3, setSelectedState3] = useState();

  const statusData = [
    { id: 1, title: "Muddasir" },
    { id: 2, title: "Azeem" },
  ];
  const statusData2 = [
    { id: 1, title: "Friend" },
    { id: 2, title: "Relitive" },
  ];
  const statusData3 = [
    { id: 1, title: "Friend" },
    { id: 2, title: "Relitive" },
  ];

  useEffect(() => {
    document.addEventListener("click", () => {
      setHide(false);
      setHide2(false);
      setHide3(false);
    });
  }, []);
  return (
    <div className="add-recommend flex">
      <div className="wrap flex flex-col">
        <div className="add-recommend-heading s22 font b6 flex aic jc-sb">
          <div className=" flex flex-col">
            <div className="h-m">Ask for a recommendation</div>
            <div className="h-s s15 font b5">
              Help us personalize your request
            </div>
          </div>
          <div className="close-icon pointer" onClick={(e) => setOpen5(false)}>
            <CloseIcon />
          </div>
        </div>
        <div className="input-section flex flex-col">
          <p className="lbl">Who do you want to ask?</p>
          <div className="dropDown flex aic jc flex-col rel">
            <div className="category flex aic">
              <div
                className="cbox cleanbtn flex aic rel"
                onClick={(e) => {
                  e.stopPropagation();
                  setHide(!hide);
                }}
              >
                <div className="slt flex aic">
                  <div className="unit-name flex aic font s14 b4">
                    <span
                      className="unit-eng flex aic font s14 b4"
                      placeholder="Search for people"
                    >
                      {selectedState
                        ? selectedState.title
                        : "Search for people"}
                    </span>
                  </div>
                </div>
                <div className="arrow s12 c666 anim icon-chevron-down" />
                <div>
                  <DropDownIcon />
                </div>
              </div>
            </div>
            <div className={`block flex aic abs ${hide ? "show" : ""}`}>
              <div className="manue flex aic col anim">
                {statusData.map((item, index) => (
                  <div
                    key={index}
                    className="slt flex aic"
                    onClick={(e) => {
                      setHide(!hide);
                      setSelectedState(item);
                    }}
                  >
                    <div className="unit-name flex aic font s14 b4">
                      <span className="unit-eng flex aic font s14 b4">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-s s15 font b5">How do you know David anderson?</div>
        <div className="input-section flex flex-col">
          <p className="lbl">Relationship</p>
          <div className="dropDown flex aic jc flex-col rel">
            <div className="category flex aic">
              <div
                className="cbox cleanbtn flex aic rel"
                onClick={(e) => {
                  e.stopPropagation();
                  setHide2(!hide2);
                }}
              >
                <div className="slt flex aic">
                  <div className="unit-name flex aic font s14 b4">
                    <span
                      className="unit-eng flex aic font s14 b4"
                      placeholder="Please select"
                    >
                      {selectedState2 ? selectedState2.title : "Please select"}
                    </span>
                  </div>
                </div>
                <div className="arrow s12 c666 anim icon-chevron-down" />
                <div>
                  <DropDownIcon />
                </div>
              </div>
            </div>
            <div className={`block flex aic abs ${hide2 ? "show" : ""}`}>
              <div className="manue flex aic col anim">
                {statusData2.map((item, index) => (
                  <div
                    key={index}
                    className="slt flex aic"
                    onClick={(e) => {
                      setHide2(!hide);
                      setSelectedState2(item);
                    }}
                  >
                    <div className="unit-name flex aic font s14 b4">
                      <span className="unit-eng flex aic font s14 b4">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="input-section flex flex-col">
          <p className="lbl">Position at the time</p>
          <div className="dropDown flex aic jc flex-col rel">
            <div className="category flex aic">
              <div
                className="cbox cleanbtn flex aic rel"
                onClick={(e) => {
                  e.stopPropagation();
                  setHide3(!hide3);
                }}
              >
                <div className="slt flex aic">
                  <div className="unit-name flex aic font s14 b4">
                    <span
                      className="unit-eng flex aic font s14 b4"
                      placeholder="Please select"
                    >
                      {selectedState3 ? selectedState3.title : "Please select"}
                    </span>
                  </div>
                </div>
                <div className="arrow s12 c666 anim icon-chevron-down" />
                <div>
                  <DropDownIcon />
                </div>
              </div>
            </div>
            <div className={`block flex aic abs ${hide3 ? "show" : ""}`}>
              <div className="manue flex aic col anim">
                {statusData3.map((item, index) => (
                  <div
                    key={index}
                    className="slt flex aic"
                    onClick={(e) => {
                      setHide3(!hide);
                      setSelectedState3(item);
                    }}
                  >
                    <div className="unit-name flex aic font s14 b4">
                      <span className="unit-eng flex aic font s14 b4">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="add-recommend-block flex flex-col">
          <p className="lbl">Include a personalized message</p>
          <textarea
            type="text"
            className="desc cleanbtn font"
            placeholder="Hi, would you write me a recommendation please?"
            value={searchPeople}
            onChange={(e) => setSearchPeople(e.target.value)}
          />
        </div>
        <div className="action flex">
          <button
            className="btn cleanbtn button font s16 b4"
            onClick={() => {
              setOpen5(false);
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecommendation;