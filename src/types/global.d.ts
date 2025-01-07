interface BaseModel {
    _id?: string;
    created?: Date;
    updated?: Date;
    deleted?: Date;
  }
  
  interface UserModel {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }
  