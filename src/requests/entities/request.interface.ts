export interface RequestKey {
  id: string;
}

export interface Request extends RequestKey {
  student_id?: string;
  problem_description?: string;
  problem_image_data?: string;
  problem_school_level?: string;
  problem_school_subject?: string;
  problem_school_chapter?: string;
  problem_difficulty?: string;
}
