import React, { useState, useRef } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { CircularProgress } from '@mui/material';

import { openErrorNotification, openNotification } from '../../helpers';

import "./DisputeModal.scss"
import { createdisputeAPI } from '../../Api/disputeAPI';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DisputeModal = ({ modalData, setModalData, setReloadPage }) => {
    let fileInput = useRef(null)

    const [enteredData, setEnteredData] = useState({
        title: "",
        description: "",
    });

    const [disputeImg, setDisputeImg] = useState({
        Location: null,
        file: null
    });

    const [loading, setLoading] = useState(false);

    const enteringData = (event) => {
        let { name, value } = event.target;

        setEnteredData((preVal) => {
            return {
                ...preVal,
                [name]: value
            }
        });
    };

    const openUpload = () => {
        fileInput.current.click();
    };
    const uploadFile = async (event) => {
        let ImgFile = event.target.files[0];
        let ImgUrl = URL.createObjectURL(ImgFile);

        setDisputeImg({
            Location: ImgUrl,
            file: ImgFile
        });
    };

    const saveData = async () => {
        setLoading(true);
        if (!enteredData.title || !enteredData.description || !disputeImg.file) {
            openErrorNotification("Please Fill all the Fields")
            setLoading(false)
            return
        }
        let formData = new FormData();

        formData.append("disputeImg", disputeImg.file)

        formData.append("booking", modalData.id)
        formData.append("title", (enteredData.title));
        formData.append("description", (enteredData.description));
        let res = await createdisputeAPI(formData)
        if (res.error != null) {
            openNotification(res.error?.message || "Request Failed")
            setLoading(false)
        } else {
            openNotification(res.data.message)
            handleClose()
        }
    }

    const handleClose = (reload) => {
        setModalData((preVal) => {
            return {
                open: false,
                id: null
            }
        });
        setReloadPage((preVal) => {
            return !preVal
        })
    };


    return (
        <Dialog
            open={modalData.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <input type="file" ref={fileInput} onChange={uploadFile} style={{ display: "none" }} />
            <DialogTitle>{"Create Dispute :"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    <div className="bulk_mail_box">
                        <div className="line_break"></div>
                        <div className="sections_box">
                            <div className="sections_box">
                                <div className="section_box">
                                    <div className="section">
                                        <div className="line">
                                            <div className="input_box">
                                                <div className="title">Title</div>
                                                <input type="text" name='title' onChange={enteringData} value={enteredData.title} />
                                            </div>
                                        </div>
                                        <div className="line">
                                            <div className="input_box">
                                                <div className="title">Description :</div>
                                                <textarea id="" cols="10" rows="3" name='description' onChange={enteringData} value={enteredData.description}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="section_box">
                                    <div className="line_space">
                                        <div className="sub_heading">Image</div>
                                    </div>

                                    <div className="section">
                                        <div className="line" style={{ flexWrap: "wrap" }}>
                                            <div className="input_box" style={{ width: "auto" }}>
                                                <div className="title">
                                                    Upload Image
                                                </div>
                                                <div className="upload_box" onClick={openUpload}>
                                                    {
                                                        disputeImg.Location ?
                                                            <>
                                                                <img src={disputeImg.Location} alt="" />
                                                            </>
                                                            :
                                                            <>
                                                                <div className="upload">
                                                                    <b>+</b>
                                                                    Upload Image
                                                                </div>
                                                            </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className="btn_box">
                    {
                        loading ?
                            <Button className='btn' style={{ cursor: "no-drop" }}> <CircularProgress size="1rem" style={{ color: "white" }} /> </Button>
                            :
                            <Button className='btn' onClick={saveData}> Create </Button>
                    }
                    <Button className='btn' onClick={handleClose} style={{ backgroundColor: "red" }}> cancel </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}

export default DisputeModal;