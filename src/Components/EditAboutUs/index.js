import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CloseIcon } from '../../Icons';
import { updateUser } from '../../redux/actions/profile';

const EditAboutUs = ({ about, setOpen1, setLoading }) => {
  const dispatch = useDispatch();
  const [editAbout, setEditAbout] = useState(about);

  return (
    <div className='edit-about-us flex'>
      <div className='wrap flex flex-col'>
        <div className='edit-about-us-heading s18 font b5 flex aic jc-sb'>
          <div>Edit About Us</div>
          <div
            className='close-icon pointer'
            onClick={(e) => {
              setOpen1(false);
            }}
          >
            <CloseIcon />
          </div>
        </div>
        <div className='edit-about-us-block flex relative'>
          <textarea
            type='text'
            className='desc cleanbtn font'
            value={editAbout}
            maxLength={500}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setEditAbout(e.target.value);
              }
            }}
          />
          <span className='char-counter'>{editAbout.length}/500</span>
        </div>

        <div className='action flex'>
          <button
            className='btn cleanbtn button font s16 b4'
            onClick={() => {
              dispatch(updateUser(setLoading, { about: editAbout }, setOpen1));
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// const EditAboutUs = ({ about, setOpen1, setLoading }) => {
//   const dispatch = useDispatch();
//   const [editAbout, setEditAbout] = useState(about);

//   return (
//     <div className='edit-about-us flex'>
//       <div className='wrap flex flex-col'>
//         <div className='edit-about-us-heading s18 font b5 flex aic jc-sb'>
//           <div>Edit About Us</div>
//           <div
//             className='close-icon pointer'
//             onClick={(e) => {
//               setOpen1(false);
//             }}
//           >
//             <CloseIcon />
//           </div>
//         </div>
//         <div className='edit-about-us-block flex '>
//           <textarea
//             type='text'
//             className='desc cleanbtn font'
//             value={editAbout}
//             maxLength={500}
//             onChange={(e) => setEditAbout(e.target.value)}
//           />
//         </div>
//         <div className='action flex'>
//           <button
//             className='btn cleanbtn button font s16 b4'
//             onClick={() => {
//               dispatch(updateUser(setLoading, { about: editAbout }, setOpen1));
//             }}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

export default EditAboutUs;
