import React ,{useEffect} from "react";
import AppInput from "../ui/AppInput";
import PasswordInput from "../ui/PasswordInput";
import AppText from "../ui/AppText";
import AppButton from "../ui/AppButton";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { setToken } from "../../utils/tokenManager";



function LoginForm( {setMode , onLoginSuccess , registeredEmail}) {
  const {setUser , setAccessToken} = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
 
  useEffect(()=>{
   
    if(registeredEmail){
      setValue("email", registeredEmail);
    }
  },[registeredEmail, setValue])
  const onSubmit = async (data) => {
    try {
       const response = await login(data);
       
       setUser(response.user);
       setAccessToken(response.accessToken);
       setToken(response.accessToken);

    onLoginSuccess(response);
      
    } catch (error) {

     const{code , message} = error.response?.data || {};
     if(code === "INVALID_CREDENTIALS"){
        setError("root.server", {
          type: "server",
          message,
        });
        return
       
     }
     setError("root.server", {
        type: "server",
        message,
      });
      return
    }
    
   
    
  };
  return (
    <div className="  flex flex-col   gap-2  ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 "
      >
        <AppInput
          name="email"
          register={register}
          error={errors.email}
          label="Email"
          placeholder="Enter Email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
        />

        <PasswordInput
          name="password"
          register={register}
          error={errors.password}
          label="Password"
          placeholder="Enter Your Password"
          autoComplete="current-password"
          
        />
        <div className="flex py-1 justify-end">
          <AppButton
            variant="link"
            className="text-xs"
            onClick={() => {
             
            }}
          >
            Forgot Password ?
          </AppButton>
        </div>
        {
          errors.root?.server && (
            <AppText variant="small" className="text-warning text-center">
              {errors.root.server.message}
            </AppText>
          )
        }

        <AppButton
           type="submit"
          variant="primary"
          size="sm"
          fullWidth
          loading={isSubmitting}
        >
          Sign In
        </AppButton>
      </form>
      {/* foot */}
      <div className="flex items-center justify-center pt-1  text-sm">
        <AppText
          as="span"
          variant="body"
          className="text-text-secondary "
        >
          New to Senwe ?
        </AppText>
        <AppButton
          as="span"
          variant="link"
          onClick={() => {setMode("register")}}
        >
         Create one
        </AppButton>
      </div>
    </div>
  );
}

export default LoginForm;
