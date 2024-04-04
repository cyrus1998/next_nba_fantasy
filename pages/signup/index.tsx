"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { FormField, Modal, Button, Table,Form } from "semantic-ui-react";
import Router from "next/router";
import useSWR from "swr";
import { avatar } from "@/model/avatar";
import Loading from "../components/common/loader"

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<any>);

function AvatarGrid({ data,onSelectAvatar,currentAvatar }: { data: Array<avatar>,onSelectAvatar: (name: string) => void;currentAvatar: string  }) {
  return (
    <Table celled compact>
      <Table.Body>
        {
          // Split the data into chunks of 3 for each row
          Array(Math.ceil(data.length / 3))
            .fill(null)
            .map((_, rowIndex) => (
              <Table.Row key={rowIndex}>
                {Array(3)
                  .fill(null)
                  .map((_, colIndex) => {
                    const item = data[rowIndex * 3 + colIndex];
                    if (item) {
                      console.log("checking",currentAvatar === item.name)
                      return (
                        <Table.Cell key={item._id.$oid} >
                          <button 
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            onClick={() => {
                              onSelectAvatar(item.name)
                            }}>
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className={
                              currentAvatar === item.name
                                ? "w-12 h-12 border-solid border-blue-500 border-[5px]" // with border when currentAvatar matches
                                : "w-12 h-12"                          // without border
                            }
                          />
                          </button>
                        </Table.Cell>
                      );
                    }
                    // Render an empty cell if there's no more data
                    return <Table.Cell key={rowIndex + "-" + colIndex} />;
                  })}
              </Table.Row>
            ))
        }
      </Table.Body>
    </Table>
  );
}

export default function Signup() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data, error } = useSWR("/api/avatar", fetcher,{
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  });
  const [registerError, setRegisterError] = useState("");
  const [pop, setPop] = useState(false);
  const [selectPop, setSelectPop] = useState(false);
  const [selectAvatar, setSelectAvatar] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSelectAvatar = (avatarName: string) => {
    setSelectAvatar(avatarName);
    setValue("avatar", avatarName);
  }


  const onSubmit = async (data: any) => {
    setRegisterError("");
    console.log("data", data);
    let body = {
      email: data.email,
      name: data.name,
      password: data.password,
      confirm: data.confirm,
      avatar: data.avatar,
    };
    if (data?.confirm !== data?.password) {
      setRegisterError(
        "Your password is not identical to the confirmed password"
      );
      return;
    }else if(data?.avatar===""){
      setRegisterError(
        "Your haven't selected avatar"
      );
      return;
    }
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      console.log("res", response);
      if (!res.ok || response?.error) {
        setRegisterError(
          response?.error?.email.message || response?.error?.password.message
        );
        return;
      } else {
        setTimeout(() => setPop(true), 3000);
        // Router.push('/login')
      }
    } catch (err: any) {
      setRegisterError(err);
    }
  };
  useEffect(() => {
    console.log("data",data)
    if (data || error) {
      setLoading(false);
    }
  }, [data]);
  useEffect(() => {
    console.log("selectAvatar",selectAvatar)
  }, [selectAvatar]);
  useEffect(() => {
    console.log("loading",loading)
  }, [loading]);
  if(loading) {
    return (
        <div className="h-screen flex items-center justify-center">
          <Loading></Loading>
        </div>
    )
  }
    return (

      <div className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center -z-[-1]"
          style={{ backgroundImage: "url('/curry.jpeg')", opacity: 0.2 }}
        ></div>
        <div className="h-screen flex items-center justify-center">
          <div className="shadow-2xl p-6 rounded-md h-3/4 w-1/5 z-50 relative bg-white">
            <Form
              className="flex flex-col space-y-[45px] w-full h-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="font-bold	subpixel-antialiased underline-offset-0	text-2xl mb-[60px]">
                Create Account
              </label>
              <FormField>
                <div className="flex flex-col items-center justify-center">
                  <label className="font-bold subpixel-antialiased underline-offset-0 text-base">
                    Name
                  </label>
                  <div className="md:w-2/3">
                    <input
                      {...register("name")}
                      id="name"
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </FormField>
              <FormField>
                <div className="flex flex-col items-center justify-center">
                  <label className="font-bold subpixel-antialiased underline-offset-0 text-base">
                    Email
                  </label>
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
                  <label className="font-bold	subpixel-antialiased underline-offset-0	text-base">
                    Password
                  </label>
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
              <FormField>
                <div className="flex flex-col items-center justify-center">
                  <label className="font-bold	subpixel-antialiased underline-offset-0	text-base">
                    Confirm Password
                  </label>
                  <div className="md:w-2/3">
                    <input
                      {...register("confirm")}
                      type="password"
                      id="confirm"
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </FormField>
              <FormField>
                <div className="flex flex-col items-center justify-center">
                  <label className="font-bold	subpixel-antialiased underline-offset-0	text-base">
                    avatar
                  </label>
                  <div className="md:w-2/3 flex flex-col items-center justify-center">
                    {selectAvatar!==""&&
                    <img src={data.find((x:avatar) => x.name === selectAvatar)?.avatar} style={{ width: "50px", height: "50px" }}/>
                    }
                    <button
                      className="md:w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-none rounded w-full"
                      onClick={() => setSelectPop(true)}
                      type="button"
                    >
                      Select
                    </button>
                    <input type="hidden" {...register("avatar")} value={selectAvatar} />
                  </div>
                </div>
              </FormField>
              <div className="space-y-4">
                <FormField className="flex flex-col items-center justify-center">
                  <button className="md:w-2/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-none rounded w-full">
                    Create New Account
                  </button>
                </FormField>
              </div>
              {registerError ? (
                <span style={{ color: "red" }}>{registerError}</span>
              ) : null}
            </Form>
          </div>
        </div>
        <div>
          <Modal open={pop} size="small">
            <Modal.Content>User created!</Modal.Content>
            <Modal.Actions>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-none rounded"
                onClick={() => {
                  setPop(false);
                  Router.push("/login");
                }}
              >
                OK
              </button>
            </Modal.Actions>
          </Modal>
        </div>
        <div>
          <Modal open={selectPop} size="small">
            <Modal.Content>
              <AvatarGrid
               data={data} 
               onSelectAvatar={handleSelectAvatar}
                currentAvatar={selectAvatar}></AvatarGrid>
            </Modal.Content>
            <Modal.Actions>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-none rounded"
                onClick={() => {
                  setSelectPop(false);
                }}
              >
                OK
              </button>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    );  
}
