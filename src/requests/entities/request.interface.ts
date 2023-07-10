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
  problem?: Problem;
  teacher_ids?: string[];
  created_at?: string;
}
