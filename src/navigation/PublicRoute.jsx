import {Navigate} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth";
import LoadingScreen from "@/components/loading/LoadingScreen";

const PublicRoute = ({children}) => {
    const {user , isLoading , accessToken} = useAuth();
    if(isLoading) return <LoadingScreen />;
    if(user && accessToken) return <Navigate to="/" replace />;
    return children;
};

export default PublicRoute;