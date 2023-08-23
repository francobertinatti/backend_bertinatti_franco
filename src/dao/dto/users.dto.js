class UsersDTO{
    constructor(userSession){
        this.first_name = userSession.first_name;
        this.last_name = userSession.last_name;
        this.email = userSession.email;
        this.age = userSession.age;
        this.role = userSession.role
        this.last_connection = userSession.last_connection   
    }
}

module.exports = UsersDTO
