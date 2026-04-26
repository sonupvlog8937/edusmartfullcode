import { configureStore } from "@reduxjs/toolkit";
import loginReducer            from "./loginSlice";
import visitorBookReducer      from "./visitorBookSlice";
import admissionEnquiryReducer from "./admissionEnquirySlice";
import phoneCallLogReducer     from "./phoneCallLogSlice";
import postalRecordReducer     from "./postalRecordSlice";
import complaintReducer        from "./complaintSlice";
import setupFrontOfficeReducer from "./setupFrontOfficeSlice";
import studentAdmissionReducer from "./studentAdmissionSlice";
import studentSettingsReducer  from "./studentSettingsSlice";
import studentManagementReducer from "./studentManagementSlice";
import publicSchoolReducer     from "./publicSchoolSlice";

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
        studentSettings:  studentSettingsReducer,
        studentManagement: studentManagementReducer,
        publicSchool:     publicSchoolReducer,
    }
});