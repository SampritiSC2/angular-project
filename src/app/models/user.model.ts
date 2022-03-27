export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public gender: string,
    public dob: string,
    public isAdmin: boolean,
    public isActive: boolean,
    public token: string,
    public photoId: string,
    public userId: string
  ) {}
}
