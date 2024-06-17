"use client";

import { useState } from "react";
import SelectCategory from "./select-category";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { type JSONContent } from "@tiptap/react";
import { TipTapEditor } from "./Editor";

export default function SellForm() {
    const [json, setJson] = useState<null | JSONContent>(null);

  return (
    <form action="">
      <CardHeader>
        <CardTitle>Sell Your Products With Digi<span className="text-primary">Mart</span></CardTitle>
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
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Category</Label>
          <SelectCategory />
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
        </div>

        <div className="flex flex-col gap-y-2">
            <input
            type="hidden"
            name="description"
            value={JSON.stringify(json)}
            />
            <Label>Description</Label>
            <TipTapEditor json={json} setJson={setJson}/>
        </div>
      </CardContent>
    </form>
  );
}
