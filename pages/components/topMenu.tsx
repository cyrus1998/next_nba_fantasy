import React, { Component, useEffect, useState } from 'react'
import { Menu, Dropdown, DropdownMenu, MenuMenu, DropdownItem,MenuItem } from 'semantic-ui-react'
import { useSession, signOut } from "next-auth/react"
import useSWR from "swr";
import { useRouter } from "next/navigation";


export default function TopMenu({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const fetcher = (url: string) =>
        fetch(url).then((res) => res.json() as Promise<any>);

    const { data, error } = useSWR(status === "authenticated" ? "/api/avatar" + "?select=" + session?.user?.avatar : null
        , fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
    });


    if (session?.user) {
        return (
            <div>
                <Menu>
                <MenuItem
                    name="Dashboard"
                    onClick={()=>router.push("/")}
                    >
                    </MenuItem>
                    <MenuItem
                    name="lottery"
                    onClick={()=>router.push("/lottery")}
                    >
                    </MenuItem>
                    <MenuMenu position='right'>
                        <Dropdown
                            item
                            trigger={
                                <span className='flex justify-between'> 
                                    <img src={data} className="mr-2 rounded-lg w-7 h-7" />
                                    <p>{session.user.name}</p>
                                </span>
                            }
                        >
                            <DropdownMenu>
                                <DropdownItem
                                    name='logout'
                                    text='logout'
                                    onClick={() => signOut()}
                                />
                            </DropdownMenu>
                        </Dropdown>
                    </MenuMenu>
                </Menu>
                {children}
            </div>

        )
    } else {
        return (
            <div>
                {children}
            </div>
        )
    }
}