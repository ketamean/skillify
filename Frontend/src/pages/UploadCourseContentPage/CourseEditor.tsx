import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons'
import CourseStructureSide from './CourseStructureSide'
import SectionEditor from './SectionEditor'
import { Section } from './types'
// import { useEffect, useState } from 'react'
interface CourseEditorProps {
	isEdit?: boolean,
	isAdd?: boolean,
	sections: Section[]
	currentSection?: Section | null,
	setCurrentSection: (section: Section | null) => void,
	setSections: (sections: Section[]) => void
}

const defaultCourseEditorProps: CourseEditorProps = {
	isEdit: false,
	isAdd: false,
	sections: [],
	currentSection: null,
	setCurrentSection: (_: Section | null) => {},
	setSections: (_: Section[]) => {}
}

export default function CourseEditor(props: CourseEditorProps) {
	const thisProps = { ...defaultCourseEditorProps, ...props }
	return (
		<div className="w-full h-full flex flex-col gap-y-4">
			{/* header */}
			<div className='w-full'>
				<div className="w-full">
					<h2>Course contents</h2>
				</div>
				<div className="flex flex-row items-center gap-x-2">
					{/* description */}
					<p className="text-gray-500">
						{thisProps.isEdit ? "Edit sections and your course contents" : ""}
						{thisProps.isAdd ? "Add sections and contents to your course" : ""}
					</p>
					<button className="ml-auto bg-light-green flex-none font-semibold rounded-md w-fit px-2 hover:bg-mint p-2 flex flex-row items-center gap-x-2 cursor-pointer"
						onClick={() => {
							const newSection: Section = {title: "", content: [], description: '', id: thisProps.sections.length + 1}
							thisProps.setSections([...thisProps.sections, newSection])
							thisProps.setCurrentSection(newSection)
						}}
					>
						<FontAwesomeIcon icon={faPlus} /> Add section
					</button>
				</div>
			</div>

			{/* body */}
			<div className='flex flex-row gap-x-4 w-full'>
                <div className='w-1/4'>
                    <CourseStructureSide
                        sections={thisProps.sections}
						setSections={thisProps.setSections}
						currentSection={thisProps.currentSection as Section | null}
						setCurrentSection={thisProps.setCurrentSection}
                    />
                </div>
				<div className='w-full'>
					{
						thisProps.currentSection?
							<SectionEditor 
								key={thisProps.currentSection.id} // adding key prop forces rerender when currentSection changes
								currentSection={thisProps.currentSection}
								setCurrentSection={thisProps.setCurrentSection}
							/>
							:
							<></>
					}
                    
                </div>
			</div>

			{/* submit */}
			<button className="ml-auto bg-light-green flex-none font-semibold rounded-md w-fit px-2 hover:bg-mint p-2 flex flex-row items-center gap-x-2 cursor-pointer">
				<FontAwesomeIcon icon={faCheck} /> Save course
			</button>
		</div>
	)
}