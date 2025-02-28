import { useState, useEffect } from 'react';
import Modal from 'react-modal'
interface BurgerMenuOverlayProps {
    state: boolean;
    setState: (state: boolean) => void;
}
export default function BurgerMenuOverlay(props: BurgerMenuOverlayProps) {
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth);
        })
    }, [])
    useEffect(() => {
        props.setState(false)
    }, [windowWidth])

    return (
        <Modal
            isOpen={props.state}
            onRequestClose={() => props.setState(false)}
            style={{
                overlay: {
                    zIndex: 30,
                }
            }}
            className="fixed md:hidden"
        >
            <div className="flex flex-col fixed h-full w-3/5 left-0 bg-white pt-4">
                <a href="#" className="px-4 h-12 flex items-center text-decoration-none! text-black! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200">Home</a>
                <a href="#" className="px-4 h-12 flex items-center text-decoration-none! text-black! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200">Instructor</a>
            </div>
        </Modal>
    )
}