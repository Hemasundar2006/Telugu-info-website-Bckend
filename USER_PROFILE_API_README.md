## User Profile API - Endpoints and Schemas

This document describes the User Profile API used by the frontend, including the available endpoints, request/response formats, and the profile completion logic.

### Base Path
- All routes are mounted under: `/api/user-profile`
- All routes require authentication via `Authorization: Bearer <token>`.

### Standard Response Envelope
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: { current: number; pages: number; total: number };
}
```

---

## Endpoints

### 1) Main Profile
- GET `/` → Get the authenticated user's full profile
- POST `/` → Create or update the authenticated user's full profile (send any subset of fields)
- DELETE `/` → Delete the authenticated user's profile

### 2) Summary
- GET `/summary` → Get a lightweight profile summary

### 3) Section Updates
- PUT `/personal-details` → Update `personalDetails`
  - POST `/personal-details/profile-picture` (multipart/form-data, field `avatar`) → Upload profile picture (JPG/PNG)
- PUT `/contact-details` → Update `contactDetails`
- PUT `/academic-records` → Update `academicRecords`
- PUT `/extracurricular` → Update `extracurricularActivities`
- PUT `/financial` → Update `financialInformation`
- PUT `/emergency-contacts` → Replace entire `emergencyContacts` array
- POST `/emergency-contacts/add` → Push a single emergency contact
- PUT `/additional-info` → Update `additionalInfo`

// New: Career profile sections
- PUT `/experience` → Replace entire `experience` array (work history)
- POST `/experience/add` → Push a single work experience
- DELETE `/experience/:id` → Remove one experience item
- PUT `/projects` → Replace entire `projects` array
- POST `/projects/add` → Push a single project
- DELETE `/projects/:id` → Remove one project
- POST `/resume` (multipart/form-data) field `resume` → Upload resume PDF
- DELETE `/resume` → Remove resume metadata
- POST `/video-resume` (multipart/form-data) field `video` → Upload video resume (mp4/webm)
- DELETE `/video-resume` → Remove video resume metadata

### 4) Academic Helpers
- POST `/qualifications` → Push a single qualification to `academicRecords.qualifications`

### 5) Admin
- GET `/admin/all?page=1&limit=10&search=...&filter={...}` → Paginated list of profiles (admin-only)

---

## Schemas (Frontend Types)

```typescript
interface UserProfile {
  userId: string; // ObjectId
  personalDetails: PersonalDetails;
  contactDetails: ContactDetails;
  academicRecords: AcademicRecords;
  extracurricularActivities: ExtracurricularActivities;
  financialInformation: FinancialInformation;
  emergencyContacts: EmergencyContact[];
  additionalInfo: AdditionalInfo;
  experience: WorkExperience[];           // New
  projects: Project[];                    // New
  resume?: ResumeFile;                    // New
  videoResume?: VideoResume;              // New
  applications: Applications;
  profileStatus: ProfileStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  bloodGroup?: 'A+'|'A-'|'B+'|'B-'|'AB+'|'AB-'|'O+'|'O-';
  nationality: string; // default 'Indian'
  religion?: string;
  maritalStatus: 'single'|'married'|'divorced'|'widowed';
  profilePicture?: string;
}

interface ContactDetails {
  primaryPhone: string; // 10-digit India
  secondaryPhone?: string;
  alternateEmail?: string;
  currentAddress: {
    street: string; city: string; state: string; pincode: string; country: string;
  };
  permanentAddress?: {
    street?: string; city?: string; state?: string; pincode?: string; country?: string;
  };
  isPermanentSameAsCurrent: boolean;
}

interface AcademicRecords {
  currentEducation: {
    institution?: string; course?: string; year?: string; semester?: string; rollNumber?: string; studentId?: string;
  };
  qualifications: Qualification[];
  courses: Course[];
  achievements: Achievement[];
}

interface Qualification {
  degree: string; institution: string; yearOfPassing: number;
  percentage?: number; cgpa?: number; grade?: string; board?: string; isVerified: boolean;
}

interface Course {
  courseName: string; institution: string; duration: string;
  completionDate?: string; certificate?: string; isCompleted: boolean;
}

interface Achievement {
  title: string; description?: string; date: string;
  certificate?: string;
  level: 'school'|'college'|'university'|'state'|'national'|'international';
}

interface ExtracurricularActivities {
  sports: Sport[]; clubs: Club[]; hobbies: Hobby[]; volunteerWork: VolunteerWork[]; competitions: Competition[];
}

interface Sport { sportName: string; level: 'beginner'|'intermediate'|'advanced'|'professional'; achievements?: string; startDate?: string; isActive: boolean; }
interface Club { clubName: string; role?: string; startDate?: string; endDate?: string; isActive: boolean; }
interface Hobby { hobbyName: string; description?: string; skillLevel: 'beginner'|'intermediate'|'advanced'; }
interface VolunteerWork { organization: string; role: string; startDate: string; endDate?: string; description?: string; hours?: number; isActive: boolean; }
interface Competition { competitionName: string; category: string; position?: string; date: string; certificate?: string; level: 'school'|'college'|'university'|'state'|'national'|'international'; }

interface FinancialInformation {
  familyIncome: { annualIncome?: number; incomeSource?: string; isBelowPovertyLine: boolean; };
  scholarships: FinancialScholarship[];
  feeStructure: { tuitionFee?: number; otherFees?: number; totalFee?: number; paidAmount: number; pendingAmount?: number; lastPaymentDate?: string; };
  bankDetails: { accountNumber?: string; bankName?: string; ifscCode?: string; accountHolderName?: string; };
}

interface FinancialScholarship { scholarshipName: string; amount: number; academicYear: string; status: 'applied'|'approved'|'rejected'|'disbursed'; documents: string[]; }

interface EmergencyContact { name: string; relationship: 'father'|'mother'|'brother'|'sister'|'spouse'|'guardian'|'friend'|'other'; phone: string; email?: string; address?: string; isPrimary: boolean; }

interface AdditionalInfo {
  languages: { language: string; proficiency: 'beginner'|'intermediate'|'advanced'|'native'; }[];
  skills: string[];
  socialMedia: { linkedin?: string; github?: string; twitter?: string; instagram?: string; };
  preferences: {
    notifications: { email: boolean; sms: boolean; push: boolean; };
    privacy: { showProfile: boolean; showContact: boolean; showAcademic: boolean; };
  };
}

interface Applications {
  jobs: JobApplication[]; internships: InternshipApplication[]; scholarships: ScholarshipApplication[]; partTimeJobs: PartTimeJobApplication[];
}

interface JobApplication {
  jobId: string; jobTitle: string; companyName: string; appliedDate: string;
  status: 'applied'|'under-review'|'shortlisted'|'interview-scheduled'|'rejected'|'accepted'|'withdrawn';
  applicationMethod?: string; notes?: string; interviewDate?: string; salaryOffered?: string; responseDate?: string; isActive: boolean;
}

type InternshipApplication = JobApplication;
type ScholarshipApplication = JobApplication;
type PartTimeJobApplication = JobApplication;

interface ProfileStatus { isComplete: boolean; completionPercentage: number; lastUpdated: string; isVerified: boolean; verificationDate?: string; }

// New: Experience / Projects / Resume
interface WorkExperience {
  organization: string;
  role: string;
  employmentType?: 'full-time'|'part-time'|'internship'|'contract'|'freelance';
  location?: string;
  startDate: string; // ISO
  endDate?: string;  // ISO
  isCurrent?: boolean;
  description?: string;
  achievements?: string[];
  technologies?: string[];
}

interface Project {
  title: string;
  role?: string;
  description?: string;
  startDate?: string; // ISO
  endDate?: string;   // ISO
  url?: string;       // live link
  repoUrl?: string;   // GitHub/GitLab
  technologies?: string[];
  highlights?: string[];
}

interface ResumeFile {
  url: string;          // public URL or signed URL provider key
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;    // e.g. application/pdf
  uploadedAt: string;   // ISO
}

interface VideoResume {
  url: string;                 // hosted video URL (Cloud, YouTube unlisted, etc.)
  platform?: 'gdrive'|'s3'|'youtube'|'vimeo'|'other';
  durationSeconds?: number;
  uploadedAt?: string;         // ISO
  caption?: string;
}
```

---

## Request Examples

```http
GET /api/user-profile
Authorization: Bearer <token>
```

```http
POST /api/user-profile
Authorization: Bearer <token>
Content-Type: application/json

{ "personalDetails": { "firstName": "Teja", "lastName": "K" } }
```

```http
PUT /api/user-profile/personal-details
Authorization: Bearer <token>
Content-Type: application/json

{ "firstName": "Teja", "lastName": "K", "dateOfBirth": "2000-01-01", "gender": "male" }
```

```http
POST /api/user-profile/qualifications
Authorization: Bearer <token>
Content-Type: application/json

{ "degree": "B.Tech", "institution": "ABC University", "yearOfPassing": 2022 }
```

---

## Profile Completion Logic

The backend computes profile completion before saving. This determines `profileStatus.completionPercentage` and `profileStatus.isComplete`.

```javascript
// Pre-save middleware calculates completion percentage
userProfileSchema.pre('save', function(next) {
  let completionScore = 0;
  const totalFields = 20;
  
  // Counts filled fields across different sections
  if (this.personalDetails.firstName) completionScore++;
  if (this.contactDetails.primaryPhone) completionScore++;
  // ... more field checks
  
  this.profileStatus.completionPercentage = Math.round((completionScore / totalFields) * 100);
  this.profileStatus.isComplete = this.profileStatus.completionPercentage >= 80;
  next();
});
```

Notes:
- `completionPercentage` is derived from a subset of important fields.
- `isComplete` becomes `true` when percentage ≥ 80.

---

## Auth Requirements

- Include `Authorization: Bearer <token>` in all requests.
- Admin-only endpoint: `GET /admin/all` (protect with admin guard on the server).

---

## Error Codes

- 400: Validation error (malformed input)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (admin-only when not admin)
- 404: Not Found (profile missing)
- 500: Internal server error


