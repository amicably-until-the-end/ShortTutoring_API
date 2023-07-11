export interface RequestKey {
  id: string;
}

export interface Problem {
  description: string;
  image_url: string;
  school_level: string;
  school_subject: string;
  school_chapter: string;
  difficulty: string;
}

export interface Request extends RequestKey {
  student_id?: string;
  teacher_ids?: string[];
  problem?: Problem;
  status?: string;
  tutoring_id?: string;
  created_at?: string;
}
