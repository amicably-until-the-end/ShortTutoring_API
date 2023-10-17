export interface UserListing {
  id: string;
  role: string;
  profileImage: string;
  name: string;
}

export interface StudentListing extends UserListing {
  grade: number;
  schoolLevel: string;
}

export interface TeacherListing extends UserListing {
  univ: string;
  major: string;
  reserveCnt: number;
  followerIds: string[];
  bio: string;
  rating: number;
}

export class TutoringHistory {
  tutoringId: string;
  questionId: string;
  description: string;
  schoolLevel: string;
  schoolSubject?: string;
  tutoringDate: string;
  opponentName: string;
  opponentProfileImage: string;
  recordFileUrl: string[];
  questionImage: string;
}
