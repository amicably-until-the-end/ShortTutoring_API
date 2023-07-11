export class UserEntity {
  id: string;
  name: string;
  bio?: string;
  profileImageURL?: string;
  role?: string;
  created_at?: string;

  readonly Student = new UserEntity(
    'test-student-id',
    'test-student-name',
    'test-student-bio',
    'test-student-profileImageURL',
    'student',
    'test-student-created_at',
  );

  readonly Teacher = new UserEntity(
    'test-teacher-id',
    'test-teacher-name',
    'test-teacher-bio',
    'test-teacher-profileImageURL',
    'teacher',
    'test-teacher-created_at',
  );

  constructor(
    id: string,
    name: string,
    bio?: string,
    profileImageURL?: string,
    role?: string,
    created_at?: string,
  ) {
    this.id = id;
    this.name = name;
    this.bio = bio;
    this.profileImageURL = profileImageURL;
    this.role = role;
    this.created_at = created_at;
  }
}
