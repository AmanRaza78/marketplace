"use client";

import { useEffect, useState } from "react";
import SelectCategory from "./select-category";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { type JSONContent } from "@tiptap/react";
import { TipTapEditor } from "./Editor";
import { UploadDropzone } from "@/utils/uploadthing";
import { Button } from "./ui/button";
import { SellProduct, type State } from "@/app/action";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import SubmitButton from "./submit-button";

export default function SellForm() {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(SellProduct, initalState);
  const [json, setJson] = useState<null | JSONContent>(null);
  const [images, setImages] = useState<null | string[]>(null);
  const [productFile, SetProductFile] = useState<null | string>(null);

  useEffect(()=>{
    if(state.status==="success"){
        toast.success(state.message)
    }
    else if(state.status==="error"){
        toast.error(state.message)
    }
  }, [state])

  return (
    <form action={formAction}>
      <CardHeader>
        <CardTitle>
          Sell Your Products With Digi<span className="text-primary">Mart</span>
        </CardTitle>
        <CardDescription>Describe your product in detail</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Name of Product"
            required
            minLength={3}
          />
          {state?.errors?.["name"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["name"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="Price of Product"
            name="price"
            required
            min={1}
          />
          {state?.errors?.["price"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["price"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Category</Label>
          <SelectCategory />
          {state?.errors?.["category"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["category"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="smalldescription">Small Description</Label>
          <Textarea
            id="smalldescription"
            placeholder="Small description of product"
            required
            minLength={10}
            name="smalldescription"
          />
          {state?.errors?.["smalldescription"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["smalldescription"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <input
            type="hidden"
            name="description"
            value={JSON.stringify(json)}
          />
          <Label>Description</Label>
          <TipTapEditor json={json} setJson={setJson} />
          {state?.errors?.["description"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["description"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="images" value={JSON.stringify(images)} />
          <Label>Product Images</Label>
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImages(res.map((item) => item.url));
              toast.success("Your images have been uploaded");
            }}
            onUploadError={(error: Error) => {
                toast.error("Something went wrong, try again");

            }}
          />
          {state?.errors?.["images"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["images"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="productfile" value={productFile ?? ""} />
          <Label>Product File</Label>
          <UploadDropzone
            onClientUploadComplete={(res) => {
              SetProductFile(res[0].url);
              toast.success("Your Product file has been uplaoded!");
            }}
            endpoint="productFileUpload"
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {state?.errors?.["productfile"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["productfile"]?.[0]}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton title="Create Product"/>
      </CardFooter>
    </form>
  );
}
