module.exports = {
    addUser,
    updateUser
};


function addUser(user) {
    return db('users').insert(user, 'id');
};

function updateUser(id, changes){
    return db('users').where({ id }).update(changes);
};