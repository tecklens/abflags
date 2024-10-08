import {useAuth} from '@client/context/auth'
import {Navigate, Outlet} from 'react-router-dom'
import {ReactRouter6Adapter} from "use-query-params/adapters/react-router-6";
import queryString from "query-string";
import {QueryParamProvider} from "use-query-params";

export const ProtectedRoute = () => {
  const {token} = useAuth();

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/sign-in"/>;
  }

  // If authenticated, render the child routes
  return (
    <QueryParamProvider
      adapter={ReactRouter6Adapter}
      options={{
        searchStringToObject: queryString.parse,
        objectToSearchString: queryString.stringify,
      }}
    >
      <Outlet/>
    </QueryParamProvider>
  );
};
