import { configureStore } from "@reduxjs/toolkit";
import loginReducer            from "./loginSlice";
import visitorBookReducer      from "./visitorBookSlice";
import admissionEnquiryReducer from "./admissionEnquirySlice";
import phoneCallLogReducer     from "./phoneCallLogSlice";
import postalRecordReducer     from "./postalRecordSlice";
import complaintReducer        from "./complaintSlice";
import setupFrontOfficeReducer from "./setupFrontOfficeSlice";
import studentAdmissionReducer from "./studentAdmissionSlice";

export default configureStore({
    reducer: {
        login:            loginReducer,
        visitorBook:      visitorBookReducer,
        admissionEnquiry: admissionEnquiryReducer,
        phoneCallLog:     phoneCallLogReducer,
        postalRecord:     postalRecordReducer,
        complaint:        complaintReducer,
        setupFrontOffice: setupFrontOfficeReducer,
        studentAdmission: studentAdmissionReducer,
    }
});