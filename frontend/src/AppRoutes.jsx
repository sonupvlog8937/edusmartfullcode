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
const VisitorBook = lazy(() => import("./school/components/front-office/VisitorBook"));
const PhoneCallLog = lazy(() => import("./school/components/front-office/PhoneCallLog"));
const PostalRecord = lazy(() => import("./school/components/front-office/PostalRecord"));
const Complaint    = lazy(() => import("./school/components/front-office/Complaint"));
const SetupFrontOffice = lazy(() => import("./school/components/front-office/SetupFrontOffice"));
const HomeworkList = lazy(() => import("./school/components/homework/HomeworkList"));
const LibraryBooks = lazy(() => import("./school/components/library/LibraryBooks"));
const FeesCollection = lazy(() => import("./school/components/fees/FeesCollection"));
const TransportRoutes = lazy(() => import("./school/components/transport/TransportRoutes"));
const StudyMaterialList = lazy(() => import("./school/components/studyMaterial/StudyMaterialList"));
const LeaveManagement = lazy(() => import("./school/components/leave/LeaveManagement"));

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

// ── Accountant ────────────────────────────────────────────────────────────────
const Accountant = lazy(() => import("./accountant/Accountant"));
const AccountantDetails = lazy(() => import("./accountant/components/AccountantDetails"));

// ── Librarian ─────────────────────────────────────────────────────────────────
const Librarian = lazy(() => import("./librarian/Librarian"));
const LibrarianDetails = lazy(() => import("./librarian/components/LibrarianDetails"));

// ── Receptionist ──────────────────────────────────────────────────────────────
const Receptionist = lazy(() => import("./receptionist/Receptionist"));
const ReceptionistDetails = lazy(() => import("./receptionist/components/ReceptionistDetails"));

// ── Parent ────────────────────────────────────────────────────────────────────
const Parent = lazy(() => import("./parent/Parent"));
const ParentDetails = lazy(() => import("./parent/components/ParentDetails"));
const ChildrenList = lazy(() => import("./parent/components/ChildrenList"));

// ── Super Admin ───────────────────────────────────────────────────────────────
const SuperAdmin = lazy(() => import("./superAdmin/SuperAdmin"));
const SuperAdminDashboard = lazy(() => import("./superAdmin/components/SuperAdminDashboard"));

// ── Vice Admin ────────────────────────────────────────────────────────────────
const ViceAdmin = lazy(() => import("./viceAdmin/ViceAdmin"));
const ViceAdminDashboard = lazy(() => import("./viceAdmin/components/ViceAdminDashboard"));
const ViceAdminProfile   = lazy(() => import("./viceAdmin/components/ViceAdminProfile"));

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
          <Route path="front-office/visitor-book" element={<VisitorBook />} />
          <Route path="front-office/phone-call-log"    element={<PhoneCallLog />} />
          <Route path="front-office/postal-receive"    element={<PostalRecord recordType="Receive" />} />
          <Route path="front-office/postal-dispatch"   element={<PostalRecord recordType="Dispatch" />} />
          <Route path="front-office/complain"         element={<Complaint />} />
          <Route path="front-office/setup"            element={<SetupFrontOffice />} />
          <Route path="homework/list" element={<HomeworkList />} />
          <Route path="library/books" element={<LibraryBooks />} />
          <Route path="fees/collect" element={<FeesCollection />} />
          <Route path="transport/routes" element={<TransportRoutes />} />
          <Route path="study-material/upload" element={<StudyMaterialList />} />
          <Route path="leave/approve" element={<LeaveManagement />} />
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

        {/* ── Accountant ── */}
        <Route path="accountant" element={<ProtectedRoute allowedRoles={["ACCOUNTANT"]}><Accountant /></ProtectedRoute>}>
          <Route index element={<AccountantDetails />} />
          <Route path="details" element={<AccountantDetails />} />
        </Route>

        {/* ── Librarian ── */}
        <Route path="librarian" element={<ProtectedRoute allowedRoles={["LIBRARIAN"]}><Librarian /></ProtectedRoute>}>
          <Route index element={<LibrarianDetails />} />
          <Route path="details" element={<LibrarianDetails />} />
        </Route>

        {/* ── Receptionist ── */}
        <Route path="receptionist" element={<ProtectedRoute allowedRoles={["RECEPTIONIST"]}><Receptionist /></ProtectedRoute>}>
          <Route index element={<ReceptionistDetails />} />
          <Route path="details" element={<ReceptionistDetails />} />
        </Route>

        {/* ── Parent ── */}
        <Route path="parent" element={<ProtectedRoute allowedRoles={["PARENT"]}><Parent /></ProtectedRoute>}>
          <Route index element={<ParentDetails />} />
          <Route path="details" element={<ParentDetails />} />
          <Route path="children" element={<ChildrenList />} />
        </Route>

        {/* ── Super Admin ── */}
        <Route path="super-admin" element={<ProtectedRoute allowedRoles={["SUPERADMIN"]}><SuperAdmin /></ProtectedRoute>}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
        </Route>

        {/* ── Vice Admin ── */}
        <Route path="vice-admin" element={<ProtectedRoute allowedRoles={["VICEADMIN"]}><ViceAdmin /></ProtectedRoute>}>
          <Route index element={<ViceAdminDashboard />} />
          <Route path="dashboard" element={<ViceAdminDashboard />} />
          <Route path="profile"   element={<ViceAdminProfile />} />
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
