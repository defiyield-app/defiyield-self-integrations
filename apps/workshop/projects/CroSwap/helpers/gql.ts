import { CROSWAP_SUBGRAPH_URL } from './const';
import { Context } from '../../../../sandbox/src/types/module';

const headers = {
  'Content-Type': 'application/json',
};

export class GraphQLQuery {
  query: string;
  variables: any;

  constructor(query: string, variables: any | null = null) {
    this.query = query;
    this.variables = variables;
  }

  execute(ctx: Context, operationName = '') {
    return ctx.axios({
      url: CROSWAP_SUBGRAPH_URL,
      method: 'POST',
      headers,
      data: {
        query: this.query,
        variables: this.variables,
        operationName: operationName,
      },
    });
  }
}

export function subgraph<T>(
  ctx: Context,
  operationName: string,
  query: string,
  variables: any | null = null,
): Promise<T> {
  return new GraphQLQuery(query, variables).execute(ctx, operationName).then((data) => {
    if (data.data.errors) throw new Error(data.data.errors[0].message);
    return data.data.data;
  });
}
