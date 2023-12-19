export default class userDto {
    constructor(user){
        this.id = user.id;
        this.name = user.username;
        this.email = user.email;
        this.rol = user.rol;
        this.cart = user.cart;
    }
}