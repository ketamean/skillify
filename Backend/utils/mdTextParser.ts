export class MdTextParser {
    async parse(text: string): Promise<string> {
        return Promise.resolve(text)
    }
}

import { marked } from 'marked';

class MdTextParseToHTML extends MdTextParser {
    async parse(text: string): Promise<string> {
        return await marked.parse(text)
    }
}