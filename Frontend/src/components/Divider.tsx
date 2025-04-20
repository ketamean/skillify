interface DividerProps {
    className?: string
}

export default function Divider(props: DividerProps) {
    return (
        <div className={`${props.className ? props.className : "w-full h-0.25 bg-black"}`}></div>
    )
}