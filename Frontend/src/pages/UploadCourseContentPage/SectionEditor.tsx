import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Divider from '../../components/Divider'
import SectionContentList from './SectionContentList'
import { faArrowLeft, faFeather, faFilePdf, faQuestion, faVideo } from '@fortawesome/free-solid-svg-icons'
import { Section, Material, Video, Quiz, Document } from './types'
import { useEffect, useState } from 'react'
import { DocumentEditor, QuizEditor, VideoEditor } from './ContentEditor'
interface SectionDetailsEditorProps {
    currentSection: Section,
    setCurrentSection: (section: Section | null) => void
}

export default function SectionDetailsEditor (props: SectionDetailsEditorProps) {
    const [materials, setMaterials] = useState<Material[]>(props.currentSection.content)
    const [newSectionData, setNewSectionData] = useState<Section>({...props.currentSection })
    const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null)
    const [warnSaveOn, setWarnSaveOn] = useState<boolean>(false)
    useEffect(() => {
        setNewSectionData({...newSectionData, content: materials })
    }, [materials]) 
    return (
        <div className="border-1 w-full h-full pt-4 pb-2 px-4 rounded-xl flex flex-col gap-y-4 min-w-fit">
            <div className='flex flex-row items-center gap-x-3'>
                <button className='flex flex-row items-center cursor-pointer'
                    onClick={() => {
                        if (warnSaveOn) {
                            // show warning
                            console.log("Show warning")
                        } else {
                            props.setCurrentSection(null);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h3>Section Details</h3>
                <button className='flex flex-row ml-auto items-center bg-light-green py-2 px-4 rounded-lg text-green-800 font-semibold hover:bg-light-teal cursor-pointer'
                    type='button'
                    onClick={() => {
                        Object.assign(props.currentSection, newSectionData)
                        props.setCurrentSection(null);
                        setWarnSaveOn(false)
                        // props.setCurrentSection(props.currentSection)
                    }}
                >
                    Save
                </button>
                <button className="flex flex-row items-center gap-x-2 cursor-pointer text-white px-4 py-2 rounded-xl font-bold transition-colors duration-300 ease-in-out bg-linear-to-bl from-violet-500 to-fuchsia-400 hover:to-blue-500 hover:from-fuchsia-500">
                    <FontAwesomeIcon icon={faFeather} className='text-white'/>AI autofill
                </button>
            </div>
            <div className="flex flex-col gap-y-1">
                <label htmlFor="sectiontitle">Section Title</label>
                <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="text" name="sectiontitle" id="sectiontitle" defaultValue={props.currentSection.title? props.currentSection.title : ''}
                    onChange={(e) => {
                        setNewSectionData({...newSectionData, title: e.target.value})
                        setWarnSaveOn(true)
                    }}
                />
            </div>

            <div className="flex flex-col gap-y-1">
                <label htmlFor="sectiondescription">Section Description</label>
                <textarea className=" px-2 h-32 border border-gray-300 rounded-sm resize-none" name="sectiondescription" id="sectiondescription" defaultValue={props.currentSection.description? props.currentSection.description : ''}
                    onChange={(e) => {
                        setNewSectionData({...newSectionData, description: e.target.value})
                        setWarnSaveOn(true)
                    }}
                ></textarea>
            </div>

            <div>
                <Divider/>
            </div>

            <div className='flex flex-col gap-y-2 min-w-fit'>
                <div className='flex flex-row items-center'>
                    <p className='pr-3 flex-none'><label className='font-semibold text-lg' htmlFor="">Section Content</label></p>
                    <div className='flex flex-row ml-auto gap-x-2'>
                        {/* buttons container */}
                        <button className='flex flex-none flex-row gap-x-2 items-center bg-tea-green py-2 px-2 rounded-lg text-green-700 font-semibold text-sm hover:bg-light-green cursor-pointer'
                            onClick={() => {
                                const newMaterial: Video = {title: "", type: "video", description: '', id: materials.length + 1, file: null, fileType: ''}
                                setMaterials([...materials, newMaterial])
                                setCurrentMaterial(newMaterial)
                            }}
                        >
                            <FontAwesomeIcon icon={faVideo}/> Add video
                        </button>

                        <button className='flex flex-none flex-row gap-x-2 items-center bg-tea-green py-2 px-2 rounded-lg text-green-700 font-semibold text-sm hover:bg-light-green cursor-pointer'
                            onClick={()=> {
                                const newMaterial: Quiz = {title: "", type: "quiz", description: '', id: materials.length + 1}
                                setMaterials([...materials, newMaterial])
                                setCurrentMaterial(newMaterial)
                            }}
                        >
                            <FontAwesomeIcon icon={faQuestion}/> Add quiz
                        </button>

                        <button className='flex flex-none flex-row gap-x-2 items-center bg-tea-green py-2 px-2 rounded-lg text-green-700 font-semibold text-sm hover:bg-light-green cursor-pointer'
                            onClick={() => {
                                const newMaterial: Document = {title: "", type: "document", description: '', id: materials.length + 1, file: null, fileType: ''}
                                setMaterials([...materials, newMaterial])
                                setCurrentMaterial(newMaterial)
                            }}
                        >
                            <FontAwesomeIcon icon={faFilePdf}/> Add doc
                        </button>
                    </div>
                </div>
                <SectionContentList contentList={materials} setContentList={setMaterials} currentMaterial={currentMaterial} setCurrentMaterial={setCurrentMaterial}/>
            </div>

            {currentMaterial ? <div><Divider/></div> : <></>}
            
            {currentMaterial && currentMaterial.type === 'video'? <VideoEditor material={currentMaterial} key={currentMaterial.id} setCurrentMaterial={setCurrentMaterial} setNewSectionData={setNewSectionData}/>: <></>}
            {currentMaterial && currentMaterial.type === 'document'? <DocumentEditor material={currentMaterial} key={currentMaterial.id}  setCurrentMaterial={setCurrentMaterial} setNewSectionData={setNewSectionData}/>: <></>}
            {currentMaterial && currentMaterial.type === 'quiz'? <QuizEditor material={currentMaterial} key={currentMaterial.id}  setCurrentMaterial={setCurrentMaterial} setNewSectionData={setNewSectionData}/>: <></>}
        </div>
    )
}