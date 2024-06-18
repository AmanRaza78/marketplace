"use client"

import { useFormState } from "react-dom";
import { Button } from "./ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { type State, UpdateUserSetting } from "@/app/action";
import { useEffect } from "react";
import { toast } from "sonner";
import SubmitButton from "./submit-button";

interface SettingsFormInterface{
    firstname: string;
    lastname: string;
    email: string;
}

export default function SettingsForm({firstname,lastname,email}:SettingsFormInterface){
    const initalState: State = { message: "", status: undefined };
    const [state, formAction] = useFormState(UpdateUserSetting, initalState)

    useEffect(()=>{
        if(state.status==="success"){
            toast.success(state.message)
        }
        else if(state.status==="error"){
            toast.error(state.message)
        }
      }, [state])

    return(
        <form action={formAction}>
            <CardHeader>
                <CardTitle>User Profile Settings</CardTitle>
                <CardDescription>
                    Here You can find and change your profile information
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-5">
                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input id="firstname" name="firstname" type="text" defaultValue={firstname}/>
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input id="lastname" name="lastname" type="text" defaultValue={lastname}/>
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={email} disabled/>
                </div>
            </CardContent>
            <CardFooter>
                <SubmitButton title="Update Profile"/>
            </CardFooter>
        </form>
    )
}