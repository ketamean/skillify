export interface Video {
    name: string;
    duration: string;
    visibility: boolean;
    link?: string;
    coverImageLink?: string;
}

// parse md to html on server side
// fe: only sanitize

export interface VideoSection {
    sectionName: string;
    videos: Video[];
}

export interface CourseDescriptionSection {
    header: string;
    content: string; // markdown supported, were CONVERTED to html
}

export interface RelatedTopic {
    name: string;
    link: string;
}

export interface CourseDetailsProps {
    courseName?: string;
    courseImageLink?: string;
    shortDescription?: string; // the max number of characters: 180
    relatedTopics?: RelatedTopic[];
    numberOfEnrollments?: number; //-------------
    content?: VideoSection[];
    linkToInstructorPage?: string;
    // linkToInstructorAvatar: string;
    courseDescriptionSections?: CourseDescriptionSection[];
    instructorName?: string;
    isFree?: boolean;
}

export interface CourseVideoSectionProps extends VideoSection {
    index: number;
}

export * from '../../pages/CoursePage'