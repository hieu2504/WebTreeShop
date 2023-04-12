export class LoggedInUser {
    constructor(id :string ,token: string, username: string, fullname: string, email: string, avatar: string, image : string) {
        this.id = id
        this.access_token = token;
        this.avatar = avatar;
        this.email = email;
        this.fullname = fullname;
        this.username = username;
        this.image = image
    }

    public id: string | undefined;
    public access_token: string;
    public username: string;
    public fullname: string;
    public email: string;
    public avatar: string;
    public image: string;
}
