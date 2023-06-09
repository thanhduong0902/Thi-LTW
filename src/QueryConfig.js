import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export const QueryConfig = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
