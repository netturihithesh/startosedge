import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Check if user profile is complete
 * @param {string} userId - User ID
 * @returns {Promise<{isComplete: boolean, missingFields: string[]}>}
 */
export const checkProfileCompleteness = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (!userDoc.exists()) {
            return { isComplete: false, missingFields: ['all'] };
        }

        const userData = userDoc.data();
        const missingFields = [];

        // Check mandatory fields
        if (!userData.name || userData.name.trim() === '') {
            missingFields.push('name');
        }
        if (!userData.email || userData.email.trim() === '') {
            missingFields.push('email');
        }
        if (!userData.college || userData.college.trim() === '') {
            missingFields.push('college');
        }

        return {
            isComplete: missingFields.length === 0,
            missingFields
        };
    } catch (error) {
        console.error('Error checking profile completeness:', error);
        return { isComplete: false, missingFields: ['error'] };
    }
};

/**
 * Calculate profile completion percentage
 * @param {Object} userData - User data from Firestore
 * @returns {number} Percentage (0-100)
 */
export const calculateProfileCompletion = (userData) => {
    if (!userData) return 0;

    const fields = {
        name: userData.name,
        email: userData.email,
        college: userData.college,
        degree: userData.degree,
        phone: userData.phone,
        bio: userData.bio,
        skills: userData.skills && userData.skills.length > 0,
        github: userData.github,
        linkedin: userData.linkedin
    };

    const totalFields = Object.keys(fields).length;
    const completedFields = Object.values(fields).filter(value => {
        if (typeof value === 'boolean') return value;
        return value && value.toString().trim() !== '';
    }).length;

    return Math.round((completedFields / totalFields) * 100);
};
