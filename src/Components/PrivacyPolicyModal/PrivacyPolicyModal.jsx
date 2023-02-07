import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


import { options } from '../../helpers';
import { get } from "../../services/RestService"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PrivacyPolicyModal = ({ openPrivacyModal, setOpenPrivacyModal }) => {
    const handleClose = () => setOpenPrivacyModal(false);

    const [loading, setLoading] = useState();
    const [data, setData] = useState();

    const getData = () => {
        setLoading(true);
        get("/privacy-policy", options)
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
                open={openPrivacyModal}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openPrivacyModal}>
                    <Box sx={style}>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Privacy Policy
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