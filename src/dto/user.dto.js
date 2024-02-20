export default class userDto {
    constructor(user){
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.rol = user.rol;
        this.cart = user.cart;
        this.status = user.status;
        this.documents = user.documents;
        this.last_connection = user.last_connection;
    }
}