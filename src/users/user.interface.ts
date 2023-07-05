export interface UserKey {
  id: string;
}

export interface StudentInfo {
  school_level?: string;
  school_grade?: number;
}

export interface TeacherInfo {
  school_name?: string;
  division?: string;
  department?: string;
  year?: number;
}

export interface User extends UserKey {
  name: string;
  bio?: string;
  profileImageURL?: string;
  role?: string;
  created_at?: string;
}
