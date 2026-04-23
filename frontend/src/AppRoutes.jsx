import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import PageLoader from "./components/system/PageLoader";
import NotFound from "./components/system/NotFound";

const Client = lazy(() => import("./client/Client"));
const Home = lazy(() => import("./client/components/home/Home"));
const Contact = lazy(() => import("./client/components/contact/Contact"));
const Login = lazy(() => import("./client/components/login/Login"));
const Register = lazy(() => import("./client/components/register/Register"));
const Logout = lazy(() => import("./client/components/logout/Logout"));

const School = lazy(() => import("./school/School"));
const SchoolDashboard = lazy(() => import("./school/components/dashboard/SchoolDashboard"));
const Class = lazy(() => import("./school/components/class/Class"));
const Students = lazy(() => import("./school/components/students/Students"));
const Teachers = lazy(() => import("./school/components/teachers/Teachers"));
const Subject = lazy(() => import("./school/components/subjects/Subjects"));
const ClassDetails = lazy(() => import("./school/components/class details/ClassDetails"));
const AssignPeriod2 = lazy(() => import("./school/components/assign period/AssignPeriod2"));
const AttendanceDetails = lazy(() => import("./school/components/attendance/attendance details/AttendanceDetails"));
const StudentAttendanceList = lazy(() => import("./school/components/attendance/StudentAttendanceList"));
const Schedule = lazy(() => import("./school/components/periods/Schedule"));
const Examinations = lazy(() => import("./school/components/examinations/Examinations"));
const NoticeSchool = lazy(() => import("./school/components/notice/NoticeSchool"));
const AdmissionEnquiry = lazy(() => import("./school/components/front-office/AdmissionEnquiry"));

const Student = lazy(() => import("./student/Student"));
const StudentDetails = lazy(() => import("./student/components/student details/StudentDetails"));
const StudentExaminations = lazy(() => import("./student/components/examination/StudentExaminations"));
const ScheduleStudent = lazy(() => import("./student/components/schedule/ScheduleStudent"));
const AttendanceStudent = lazy(() => import("./student/components/attendance/AttendanceStudent"));
const NoticeStudent = lazy(() => import("./student/components/notice/NoticeStudent"));

const Teacher = lazy(() => import("./teacher/Teacher"));
const TeacherDetails = lazy(() => import("./teacher/components/teacher details/TeacherDetails"));
const TeacherExaminations = lazy(() => import("./teacher/components/teacher examinations/TeacherExaminations"));
const TeacherSchedule = lazy(() => import("./teacher/components/periods/TeacherSchedule"));
const AttendanceTeacher = lazy(() => import("./teacher/components/attendance/AttendanceTeacher"));
const NoticeTeacher = lazy(() => import("./teacher/components/notice/Notice"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader message="Loading application…" />}>
      <Routes>
        <Route path="school" element={<ProtectedRoute allowedRoles={["SCHOOL"]}><School /></ProtectedRoute>}>
          <Route index element={<SchoolDashboard />} />
          <Route path="class" element={<Class />} />
          <Route path="class-details" element={<ClassDetails />} />
          <Route path="subject" element={<Subject />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="assign-period" element={<AssignPeriod2 />} />
          <Route path="periods" element={<Schedule />} />
          <Route path="attendance" element={<StudentAttendanceList />} />
          <Route path="attendance-student/:studentId" element={<AttendanceDetails />} />
          <Route path="examinations" element={<Examinations />} />
          <Route path="notice" element={<NoticeSchool />} />
          <Route path="front-office/admission-enquiry" element={<AdmissionEnquiry />} />
        </Route>

        <Route path="student" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Student /></ProtectedRoute>}>
          <Route index element={<StudentDetails />} />
          <Route path="student-details" element={<StudentDetails />} />
          <Route path="examinations" element={<StudentExaminations />} />
          <Route path="periods" element={<ScheduleStudent />} />
          <Route path="attendance" element={<AttendanceStudent />} />
          <Route path="notice" element={<NoticeStudent />} />
        </Route>

        <Route path="teacher" element={<ProtectedRoute allowedRoles={["TEACHER"]}><Teacher /></ProtectedRoute>}>
          <Route index element={<TeacherDetails />} />
          <Route path="details" element={<TeacherDetails />} />
          <Route path="examinations" element={<TeacherExaminations />} />
          <Route path="periods" element={<TeacherSchedule />} />
          <Route path="attendance" element={<AttendanceTeacher />} />
          <Route path="notice" element={<NoticeTeacher />} />
        </Route>

        <Route path="/" element={<Client />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
