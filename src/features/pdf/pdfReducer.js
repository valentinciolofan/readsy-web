import { SET_PDF_TEXT } from "./action";

const initialState = {
    pdfText: "",
};

const pdfReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PDF_TEXT:
            return { ...state, pdfText: action.payload };
        default:
            return state;
    }
};

export default pdfReducer;
