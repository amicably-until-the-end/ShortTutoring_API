export interface TutoringKey {
  id: string;
}

export interface Tutoring extends TutoringKey {
  request_id: string;
  student_id: string;
  teacher_id: string;
  matched_at: string;
  started_at: string;
  ended_at: string;
  status: string;
}
