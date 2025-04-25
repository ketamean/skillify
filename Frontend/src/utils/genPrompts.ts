interface Info {
    title: string,
    description: string
}

interface InfoWithVideos extends Info {
    videos: Info[]
}

export function genPromptsForDescription(header: string, sections: InfoWithVideos[], quizzes: Info[], documents: Info[]) {
    
}