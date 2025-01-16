import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TimetableComponent } from './pages/timetable/timetable.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ChatComponent } from './pages/chat/chat.component';
import { SubjectsComponent } from './pages/subjects/subjects.page';
import { ClassRoomComponent } from './pages/class-room/class-room.component';
import { ChatRoomComponent } from './pages/chat/chat-room/chat-room.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { AttendanceComponent } from './pages/subject/pages/attendance/attendance.component';
import { FilesComponent } from './pages/subject/pages/files/files.component';
import { GeneralComponent } from './pages/subject/pages/general/general.component';
import { GradesComponent } from './pages/subject/pages/grades/grades.component';
import { TasksComponent } from './pages/subject/pages/tasks/tasks.component';
import { ThreadComponent } from './pages/subject/pages/thread/thread.component';

export const routes: Routes = [
  { path: '', redirectTo: 'timetable', pathMatch: 'full' },
  {
    path: 'chat',
    component: ChatComponent,
    title: 'Chat',
    children: [
      {
        path: ':id',
        component: ChatRoomComponent,
      },
    ],
  },
  { path: 'class-room', component: ClassRoomComponent, title: 'Class Room' },
  { path: 'login', component: LoginComponent },
  { path: 'subjects', component: SubjectsComponent, title: 'Subjects' },
  { path: 'timetable', component: TimetableComponent, title: 'Timetable' },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    title: 'User Profile',
  },
  {
    path: 'subject/:id',
    component: SubjectComponent,
    title: 'Subject',
    children: [
      {
        path: 'attendace',
        component: AttendanceComponent,
        title: 'Attendance',
      },
      { path: 'files', component: FilesComponent, title: 'Files' },
      { path: 'general', component: GeneralComponent, title: 'General' },
      { path: 'grades', component: GradesComponent, title: 'Grades' },
      { path: 'tasks', component: TasksComponent, title: 'Tasks' },
      { path: 'thread', component: ThreadComponent, title: 'Thread' },
    ],
  },
];
