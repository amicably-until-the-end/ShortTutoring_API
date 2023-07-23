export class UserEntity {
  id: string;
  name: string;
  bio?: string;
  profileImage?: string;
  role?: string;
  createdAt?: string;

  readonly Student = new UserEntity(
    'test-student-id',
    'test-student-name',
    'test-student-bio',
    'test-student-profileImageURL',
    'student',
    'test-student-createdAt',
  );

  readonly Teacher = new UserEntity(
    'test-teacher-id',
    'test-teacher-name',
    'test-teacher-bio',
    'test-teacher-profileImageURL',
    'teacher',
    'test-teacher-createdAt',
  );

  constructor(
    id: string,
    name: string,
    bio?: string,
    profileImage?: string,
    role?: string,
    createdAt?: string,
  ) {
    this.id = id;
    this.name = name;
    this.bio = bio;
    this.profileImage = profileImage;
    this.role = role;
    this.createdAt = createdAt;
  }
}
