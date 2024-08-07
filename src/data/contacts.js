const contacts = {};

function getUserProfile(userId) {
    return contacts[userId] || {};
}

function updateUserProfile(userId, updates) {
    if (!contacts[userId]) {
        contacts[userId] = {};
    }
    contacts[userId] = { ...contacts[userId], ...updates };
}

module.exports = {
    getUserProfile,
    updateUserProfile
};