import { agroApi } from "@/api/agroApi";
import { Provider } from "@/interfaces/providers/provider.interface";

export const createProviderAction = async (name: string): Promise<Provider> => {
  const { data: response } = await agroApi<Provider>({
    url: '/providers/new',
    method: 'POST',
    data: {
      name
    }
  }

  );

  return response;
}