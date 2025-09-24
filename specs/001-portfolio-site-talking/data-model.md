# Data Model: Interactive Portfolio Site

## Core Entities

### Portfolio Owner Profile
**Purpose**: Central profile information for the portfolio owner
**Fields**:
- `id`: Unique identifier
- `name`: Full name
- `title`: Professional title/role
- `summary`: Professional summary/bio
- `location`: Current location
- `email`: Contact email
- `phone`: Contact phone (optional)
- `socialLinks`: Array of social media/professional links
- `skills`: Array of technical and professional skills
- `experience`: Array of work experience entries
- `education`: Array of education entries
- `certifications`: Array of professional certifications

**Validation Rules**:
- Name is required and must be 1-100 characters
- Title is required and must be 1-200 characters
- Email must be valid email format
- Social links must be valid URLs

### Project
**Purpose**: Individual portfolio projects and work samples
**Fields**:
- `id`: Unique identifier
- `title`: Project name
- `description`: Project description
- `longDescription`: Detailed project overview
- `technologies`: Array of technologies used
- `category`: Project category (web, mobile, data, etc.)
- `startDate`: Project start date
- `endDate`: Project end date (null if ongoing)
- `status`: Project status (completed, ongoing, archived)
- `images`: Array of project images/screenshots
- `links`: Object containing live URL, repository URL, etc.
- `highlights`: Array of key achievements/outcomes
- `role`: Role in the project
- `teamSize`: Number of team members (if applicable)

**Validation Rules**:
- Title is required and must be 1-200 characters
- Description is required and must be 10-500 characters
- Technologies array must not be empty
- Links must be valid URLs when provided

### Skill
**Purpose**: Technical and professional competencies
**Fields**:
- `id`: Unique identifier
- `name`: Skill name
- `category`: Skill category (technical, soft, language, etc.)
- `level`: Proficiency level (beginner, intermediate, advanced, expert)
- `years`: Years of experience
- `verified`: Whether skill is verified/certified
- `projects`: Array of project IDs where skill was used
- `description`: Optional description of skill application

**Validation Rules**:
- Name is required and must be unique
- Category must be from predefined list
- Level must be from predefined list
- Years must be non-negative number

### Chat Conversation
**Purpose**: Interactive chatbot conversations with visitors
**Fields**:
- `id`: Unique conversation identifier
- `sessionId`: Browser session identifier
- `messages`: Array of message objects
- `startTime`: Conversation start timestamp
- `lastActivity`: Last message timestamp
- `context`: Conversation context/topics discussed
- `visitorInfo`: Optional visitor information (location, referrer)

**Message Object**:
- `id`: Message identifier
- `role`: Message sender (user, assistant)
- `content`: Message content
- `timestamp`: Message timestamp
- `tokens`: Token count for API usage tracking

**Validation Rules**:
- Messages array must maintain chronological order
- Content must be non-empty for user messages
- Role must be either 'user' or 'assistant'

### Resume Data
**Purpose**: Structured resume information for portfolio population
**Fields**:
- `personalInfo`: Contact and personal information
- `summary`: Professional summary
- `workExperience`: Array of employment history
- `education`: Array of educational background
- `skills`: Categorized skills list
- `certifications`: Professional certifications
- `achievements`: Notable achievements and awards
- `languages`: Spoken/written languages
- `lastUpdated`: Data freshness timestamp

**Work Experience Object**:
- `company`: Company name
- `position`: Job title
- `startDate`: Employment start date
- `endDate`: Employment end date (null if current)
- `location`: Job location
- `description`: Role description
- `achievements`: Key achievements in role
- `technologies`: Technologies used in role

### LinkedIn Profile Data
**Purpose**: Enhanced professional information from LinkedIn
**Fields**:
- `profileUrl`: LinkedIn profile URL
- `connections`: Number of connections
- `recommendations`: Array of recommendations received
- `endorsements`: Skills endorsements count
- `posts`: Recent professional posts/articles
- `activitySummary`: Professional activity summary
- `industryInsights`: Industry-specific insights
- `networkInfo`: Professional network information
- `lastSynced`: Last synchronization timestamp

## Relationships

### Profile ↔ Projects
- One profile has many projects
- Projects reference profile owner

### Profile ↔ Skills
- One profile has many skills
- Skills can be linked to multiple projects

### Projects ↔ Technologies
- Projects use multiple technologies
- Technologies appear across multiple projects

### Conversations ↔ Profile
- Conversations reference profile data for responses
- Profile information informs chatbot context

## Data Storage Strategy

### Firestore Collections
```
/profiles/{profileId}
/projects/{projectId}
/skills/{skillId}
/conversations/{conversationId}
/resumeData/{profileId}
/linkedinData/{profileId}
```

### Local Storage
- Chat session state
- User preferences
- Cached API responses

### Static Assets
- Project images
- Resume PDF
- Profile photos
- Technology icons

## Data Flow

### Portfolio Data Loading
1. Load profile data from Firestore
2. Load associated projects and skills
3. Merge with cached resume/LinkedIn data
4. Populate portfolio sections

### Chat Context Building
1. Aggregate profile, projects, and skills data
2. Create searchable knowledge base
3. Maintain conversation history
4. Update context with new interactions

### Data Synchronization
1. Resume data parsed and stored on updates
2. LinkedIn data refreshed periodically
3. Portfolio sections updated automatically
4. Chat knowledge base rebuilt on changes