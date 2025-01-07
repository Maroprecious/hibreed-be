import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class adminGuard implements CanActivate {
  constructor() {
  }
  async canActivate(context: ExecutionContext) {
    
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    // Check if token is vali
    if (
      user.role.includes("Admin")
    ) {
      return true;
    }
    

    return false;
  }
}

  