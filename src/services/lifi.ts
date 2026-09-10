import { createClient, getRoutes } from '@lifi/sdk';

// Creating LI.FI client once, not each time the user clicks find best route
const client = createClient({
   integrator: "SEEMMOOX",
});

export async function findRoutes(
   fromChainId: number,
   toChainId: number,
   fromTokenAddress: string,
   toTokenAddress: string,
   fromAmount: string
) {
   const routesRequest = {
      fromChainId,
      toChainId,
      fromTokenAddress,
      toTokenAddress,
      fromAmount,
   };

   const result = await getRoutes(client, routesRequest);

   if (!result.routes || result.routes.length === 0) {
      throw new Error("No route found");
   }

   return result.routes;
}