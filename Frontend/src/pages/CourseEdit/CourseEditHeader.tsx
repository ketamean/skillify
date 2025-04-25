import { useItemPortalContext } from "./context"
import FileDropZone from "./FileDropZone";
import { CourseTopic } from "./types"

interface CourseEditHeaderProps {
    allTopics: CourseTopic[],
    
    courseTopics: CourseTopic[],
    setCourseTopics: React.Dispatch<React.SetStateAction<CourseTopic[]>>;
}

interface InteractableCourseTopicTagProps {
    name: string
    checked: boolean,
    onCheck: () => void
}

function InteractableCourseTopicTag(props: InteractableCourseTopicTagProps) {
    return (
        <button className={`p-2 flex justify-center min-w-fit rounded-lg cursor-pointer text-sm font-semibold border border-zinc-900 ${props.checked ? "bg-green-300 text-zinc-900 hover:bg-green-200" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"}`}
            onClick={props.onCheck}
        >
            { props.name }
        </button>
    )
}

export default function CourseEditHeader(props: CourseEditHeaderProps) {
    const { courseName, setCourseName, courseDescription, setCourseDescription, courseFee, setCourseFee, courseTopics, setCourseTopics, coursePicture, setCoursePicture, courseStatus } = useItemPortalContext()
    return (
        <div className="w-full flex flex-col gap-y-8 justify-center items-center">
            <h2>Course editor</h2>

            <div className="w-full flex flex-col gap-y-4">
                {/* Course name */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="courseName">Course Name<span className="text-xl font-bold text-red-600">*</span></label>
                    <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="text" name="courseName" id="courseName" defaultValue={courseName}
                        onChange={(e) => {
                            setCourseName(e.target.value)
                        }}
                        maxLength={20}
                    />
                </div>

                {/* Course thumbnail */}
                <div className="flex flex-col w-full gap-y-2">
                    <FileDropZone
                        file={coursePicture}
                        setFile={setCoursePicture}
                        accept="image/*"
                        header="Course thumbnail"
                    />
                </div>

                {/* Course description */}
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="courseDescription">Short Description<span className="text-xl font-bold text-red-600">*</span></label>
                    <textarea
                        className="px-2 py-1 border border-gray-300 rounded-sm resize-none"
                        name="courseDescription" id="courseDescription"
                        onChange={(e) => {
                            setCourseDescription(e.target.value)
                        }}
                        placeholder="Write in less than 100 characters"
                        defaultValue={courseDescription}
                        rows={4}
                        maxLength={100}
                    ></textarea>
                </div>

                {/* Course fee */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="courseName">Course Fee</label>
                    <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="number" name="courseFee" id="courseFee" defaultValue={courseFee}
                        onChange={(e) => {
                            const num = Number(e.target.value);
                            setCourseFee(isNaN(num) ? 0 : num)
                        }}
                        min={0}
                        max={10000000}
                    />
                </div>

                {/* Course status */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="courseName">Course Status</label>
                    <input className={`px-2 h-10 border bg-zinc-100 cursor-not-allowed font-bold border-gray-300 rounded-sm ${courseStatus === 'Published' ? 'text-green-600' : 'text-red-500'}`}
                        type="text" name="courseStatus" id="courseStatus"
                        value={courseStatus}
                        disabled={true}
                    />
                </div>

                {/* Course topics */}
                <div className="w-full flex flex-col gap-x-2 gap-y-2">
                    <p>Tags</p>
                    <div className="gap-x-2 gap-y-2 flex flex-row flex-wrap">
                        {
                            props.allTopics.map((tp) => (
                                <InteractableCourseTopicTag name={tp.name} key={tp.id}
                                    checked={
                                        courseTopics.some((val) => val.id === tp.id && val.name === tp.name)
                                    }
                                    onCheck={() => {
                                        if (courseTopics.some((val) => val.id === tp.id && val.name === tp.name)) {
                                            // already chosen
                                            const newCourseTopics = courseTopics.filter((val) => val.id !== tp.id)
                                            setCourseTopics(newCourseTopics)
                                        } else {
                                            // not chosen yet
                                            const newCourseTopics = [...courseTopics, {...tp}]
                                            setCourseTopics(newCourseTopics)
                                        }
                                    }}
                                />
                            ))
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}