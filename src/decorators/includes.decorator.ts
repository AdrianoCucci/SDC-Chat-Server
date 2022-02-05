import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Includes = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    let results: string[];

    const request: Request = context.switchToHttp().getRequest();
    const expression = /(include=[^&]*)/;
    const occurrences: RegExpExecArray = expression.exec(request.url);

    if(occurrences != null) {
      let query: string = occurrences[0];
      query = query.substring(query.indexOf("=") + 1);
      results = query.split(",");
    }

    return results;
  }
);