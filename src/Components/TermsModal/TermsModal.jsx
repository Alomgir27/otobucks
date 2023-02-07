import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


import { options } from '../../helpers';
import { get } from "../../services/RestService"

import "./TermsModal.scss"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 600,
    width: "100%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PrivacyPolicyModal = ({ openTermModal, setOpenTermModal }) => {
    const handleClose = () => setOpenTermModal(false);

    const [loading, setLoading] = useState();
    const [data, setData] = useState();

    const getData = () => {
        setLoading(true);
        get("/term-condition", options)
            .then((data) => {
                setData(data.result);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openTermModal}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openTermModal}>
                    <Box sx={style}>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <Typography id="transition-modal-title" className='title' variant="h6" component="h2">
                            Terms & Conditions
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            {data?.description}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}


export default PrivacyPolicyModal;