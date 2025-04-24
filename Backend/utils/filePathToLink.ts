import supabase from "../config/database/supabase";

export function filePathToLink(bucketName: string, filePath: string, oneTimeUse: boolean = false): string {
    const { data, error } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (error) {
        console.error("Error fetching public URL:", error);
        return "";
    }
    return data.publicUrl;
}