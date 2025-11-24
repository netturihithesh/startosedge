import { supabase } from './supabaseClient';

/**
 * Upload a video file to Supabase Storage
 * @param {File} file - The video file to upload
 * @param {string} programId - The program ID to organize videos
 * @returns {Promise<string>} - Public URL of uploaded video
 */
export const uploadVideo = async (file, programId) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${programId}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('course-videos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('course-videos')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

/**
 * Upload a thumbnail image to Supabase Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export const uploadThumbnail = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `thumbnails/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('course-videos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('course-videos')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading thumbnail:', error);
        throw error;
    }
};

/**
 * Delete a video from Supabase Storage
 * @param {string} videoUrl - The public URL of the video
 */
export const deleteVideo = async (videoUrl) => {
    try {
        // Extract file path from URL
        const filePath = videoUrl.split('/course-videos/')[1];

        const { error } = await supabase.storage
            .from('course-videos')
            .remove([filePath]);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting video:', error);
        throw error;
    }
};
