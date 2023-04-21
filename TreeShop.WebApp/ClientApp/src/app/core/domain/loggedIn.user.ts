export class LoggedInUser {
    constructor(id :string ,token: string, username: string, fullname: string, email: string, phonenumber: string, image : string, type: number) {
        this.id = id
        this.access_token = token;
        this.phonenumber = phonenumber;
        this.email = email;
        this.fullname = fullname;
        this.username = username;
        this.image = image;
        this.type = type;
    }

    public id: string | undefined;
    public access_token: string;
    public username: string;
    public fullname: string;
    public email: string;
    public phonenumber: string;
    public image: string;
    public type: number;
}
