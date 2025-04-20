import { useItemPortalContext } from "./context"

interface CourseEditHeaderProps {}

export default function CourseEditHeader(props: CourseEditHeaderProps) {
    const { courseName, setCourseName, courseDescription, setCourseDescription } = useItemPortalContext()
    return (
        <div className="w-full flex flex-col gap-y-8 justify-center items-center">
            <h2>Course editor</h2>

            <div className="w-full flex flex-col gap-y-4">
                {/* Course name */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="courseName">Course Name</label>
                    <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="text" name="courseName" id="courseName" defaultValue={courseName}
                        onChange={(e) => {
                            setCourseName(e.target.value)
                        }}
                    />
                </div>

                {/* Course description */}
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="courseDescription">Course Description</label>
                    <textarea
                        className="px-2 py-1 border border-gray-300 rounded-sm resize-none"
                        name="courseDescription" id="courseDescription"
                        onChange={(e) => {
                            setCourseDescription(e.target.value)
                        }}
                        placeholder="Markdown supported"
                        defaultValue={courseDescription}
                        rows={6}
                    ></textarea>
                </div>
            </div>
        </div>
    )
}