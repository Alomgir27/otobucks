import { actionTypes } from "../types";

const initialState = {
    isSidebarDisappear: false,
};

const others = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SIDEBAR_DISAPPEAR:
            return {
                ...state,
                isSidebarDisappear: action.payload,
            };
        default:
            return state;
    }
}

export default others