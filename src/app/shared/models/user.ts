export class User {
    Username: string;
    Token: string;

    constructor(username: string, token: string) {
        this.Username = username;
        this.Token = token;
    }
}
