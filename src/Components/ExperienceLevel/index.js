import React from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/actions/profile";

const ExperienceLevel = ({ userData, setLoading }) => {
  const dispatch = useDispatch();

  return (
    <div className='experi-level flex flex-col'>
      <div className='experi-blcok flex flex-col'>
        <div className='about-us-header flex aic'>
          <div className='left-heading s24 b5 font'>Experience Level</div>
          <div className='right-icon'></div>
        </div>
        <div className='experi-selection flex aic'>
          <div className='select-item flex flex-col'>
            <div className='radito-select flex je'>
              <button
                onClick={(e) => {
                  dispatch(
                    updateUser(setLoading, { experienceLevel: "Beginner" })
                  );
                }}
                className={`cleanbtn radio-btn rel ${
                  userData?.experienceLevel == "Beginner" ? "on" : ""
                }`}
              />
            </div>
            <div className='meta flex flex-col aic jc'>
              <div className='tag s18 font b5'>Beginner</div>
              <div className='desc s14 font'>
                I am relatively new to this field
              </div>
            </div>
          </div>
          <div className='select-item flex flex-col'>
            <div className='radito-select flex je'>
              <button
                onClick={(e) => {
                  dispatch(
                    updateUser(setLoading, { experienceLevel: "Intermediate" })
                  );
                }}
                className={`cleanbtn radio-btn rel ${
                  userData?.experienceLevel == "Intermediate" ? "on" : ""
                }`}
              />
            </div>
            <div className='meta flex flex-col aic jc'>
              <div className='tag s18 font b5'>Intermediate</div>
              <div className='desc s14 font'>
                I have substantial experience in this field
              </div>
            </div>
          </div>
          <div className='select-item flex flex-col'>
            <div className='radito-select flex je'>
              <button
                onClick={(e) => {
                  dispatch(
                    updateUser(setLoading, { experienceLevel: "Expert" })
                  );
                }}
                className={`cleanbtn radio-btn rel ${
                  userData?.experienceLevel == "Expert" ? "on" : ""
                }`}
              />
            </div>
            <div className='meta flex flex-col aic jc'>
              <div className='tag s18 font b5'>Expert</div>
              <div className='desc s14 font'>
                I have comprehensive and deep expertise in this field
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceLevel;
