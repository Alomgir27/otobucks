import { post } from '../services/RestService'

const config = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
};

const createdisputeAPI = async (data) => {
    let resolved = {
        data: null,
        error: null
    }

    try {
        const res = await post("/disputes", data, config)
        resolved.data = res
    } catch (err) {
        resolved.error = err
    }

    return resolved
}

export { createdisputeAPI }