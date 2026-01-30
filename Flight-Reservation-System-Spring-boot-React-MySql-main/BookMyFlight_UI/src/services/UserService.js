import axios from "axios";

/**
 * 
 * Using Axios library to send request to spring boot and fetch response
 * The service method handles operations for user
 */
export default class UserService {

    constructor() {
        this.uri = process.env.REACT_APP_API_URL || "http://localhost:8980";

    }

    // Service method to register new user
    async addUser(user) {
        return await axios.post(this.uri + "/createuser", user).then(response => {
            return response;
        });
    }


    getUsers() {
        return this.users;
    }

    // Service method to authenticate user
    async validateUser(username, password) {
        return await axios.get(this.uri + "/auth/" + username + "/" + password).then(res => {
            console.log(res);
            console.log(res.data);
            return res;
        });;
    }
}