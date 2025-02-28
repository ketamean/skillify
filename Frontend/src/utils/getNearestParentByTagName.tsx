export default function getNearestParentByTagName(currentElement: HTMLElement, desiredTagName: string): HTMLElement | null {
    if (!currentElement || !desiredTagName) return null

    let current = currentElement
    while (current && (current?.tagName as string).toLowerCase() != desiredTagName.toLowerCase()) {
        current = current?.parentElement as HTMLElement
    }
    return current? current : null
}