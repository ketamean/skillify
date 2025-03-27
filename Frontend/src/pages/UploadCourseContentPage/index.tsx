import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
// import { toast } from "sonner"
// import { Toaster } from "@/components/ui/sonner"
import CourseEditor from "./CourseEditor";
import { Quiz, Section, Video, Document } from "./types";

/*
export interface Section {
    id: UniqueIdentifier,
    title: string,
    content: Material[],
    description: string
}
*/

const sampleMaterials: (Video | Document | Quiz)[] = [
	{
		id: 1,
		title: 'hello1',
		description: 'hello',
		type: 'video',
	} as Video,
	{
		id: 2,
		title: 'hello2',
		description: 'hello',
		type: 'document',
	} as Document,
	{
		id: 3,
		title: 'hello3',
		description: 'hello',
		type: 'video',
	} as Video,
	{
		id: 4,
		title: 'hello4',
		description: 'hello',
		type: 'video',
	} as Video,
	{
		id: 5,
		title: 'hello5',
		description: 'hello',
		type: 'quiz',
	} as Quiz
]

const sampleSections: Section[] = [
	{title: "How to know", content: sampleMaterials, description: 'Hihi ne ne', id: 1},
	{title: "bitchessssssssssssssssssssssssssssssssssssssssssssssssss no please stoppppppppppppppppppppppppppppppp", content: [], description: 'ua alo', id: 2},
	{title: "Random text hehe hihi haha huhu", content: [], description: 'jztr', id: 3}
]

export default function UploadCourseContentPage() {
	const [currentSection, setCurrentSection] = useState<Section | null>(null);
	const [sections, setSections] = useState<Section[]>([]);
	useEffect(() => {
		setSections(sampleSections);
	}, [])
	return (
		<>
		  	<NavBar user={{fname: 'Linda', lname: 'Nee Xin Chao'}}/>
			<div className="text-black w-full lg:px-40 px-4 py-8">
				<CourseEditor isEdit={true} sections={sections} setSections={setSections} currentSection={currentSection} setCurrentSection={setCurrentSection}/>
			</div>
		  	<Footer/>
		</>
	  ); 
}