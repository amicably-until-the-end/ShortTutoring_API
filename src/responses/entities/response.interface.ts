export interface ResponseKey {
  request_id?: string;
}

export interface Response extends ResponseKey {
  student_id: string;
  teacher_ids?: string[];
}
