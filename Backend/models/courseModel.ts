import client from '../config/database/client'
export interface ICourse {
    id: number,
    image_link: string,
    name: string,
    created_at: string,
    status: string,
    fee: number,
    short_description: string,
    instructor_id: string
}

const model = {
    getCourseById: async (id: number, cols = '*'): Promise<ICourse | null> => {
        try {
            const query = `SELECT ${cols} FROM courses WHERE id = $1`;
            const values = [id];
            const result = await client.query(query, values);
            return result?.rows[0];
        } catch (e) {
            console.log(e);
            return null;
        }
    },
}

export default model;