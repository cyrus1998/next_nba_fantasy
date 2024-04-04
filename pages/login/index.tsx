"use client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { FormField, Confirm,Modal } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import Router from "next/router";
import { useSession } from "next-auth/react"
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data: session } = useSession()
  const [error, setError] = useState("");
  const [pop, setPop] = useState(false);
  const onSubmit = async (data: any) => {
    console.log("data",data);
    let option = {
      redirect: false,
      email: data.email,
      password: data.password,
    };
    const res = await signIn("credentials", option);
    console.log("res", res);
    if (res?.error) {
      console.log("error", res.error);
      setError(res.error);
      setPop(true);
      console.log("state", pop, error);
    }else{
        Router.push('/')
    }
  };

  useEffect(()=>{
    setError("")
  },
  [])
  if(session){
    Router.push('/')
  }

  return (
    <div className="relative h-screen">
    <div className="absolute inset-0 bg-cover bg-center -z-[-1]"  style={{ backgroundImage: "url('/curry.jpeg')", opacity: 0.2}}>
    </div>
    <div className="h-screen flex items-center justify-center">
      <div className="shadow-2xl p-6 rounded-md h-3/4 w-1/5 z-50 relative bg-white">
      <Form className="flex flex-col space-y-[45px] w-full h-full" onSubmit={handleSubmit(onSubmit)}>
        <label className="font-bold	subpixel-antialiased underline-offset-0	text-2xl mb-[60px]">Welcome Back!</label>
          <FormField>
            <div className="flex flex-col items-center justify-center">
              <label className="font-bold	subpixel-antialiased underline-offset-0	text-base">Email</label>
              <div className="md:w-2/3">
                <input
                {...register("email")}
                  id="email"
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </FormField>
          <FormField>
            <div className="flex flex-col items-center justify-center">
            <label className="font-bold	subpixel-antialiased underline-offset-0	text-base">Password</label>
              <div className="md:w-2/3">
                <input
                {...register("password")}
                  type="password"
                  id="password"
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  />
              </div>
            </div>
          </FormField>
          <FormField className="flex flex-col items-center justify-center">
            <button className="md:w-2/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-none rounded w-full">Login</button>
          </FormField>
          <FormField className="flex flex-col items-center justify-center">
            <button 
            type="button"
            className="md:w-2/3 bg-white text-blue-500 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 border-none shadow-2xl rounded w-full"
            onClick={() => Router.push('/signup')}
            >Create Account</button>
          </FormField>
          {error?<div className="flex flex-col items-center justify-center"><span style={{color:"red"}}>{error}</span></div>:null}
        </Form>
      </div>
    </div>
    </div>
  );
}

