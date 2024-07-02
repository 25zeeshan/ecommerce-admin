"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod"

interface SettingsFormProps {
  initialdata: Store;
}

const FormSchema = z.object({
    name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof FormSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialdata }) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialdata
    })

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button variant={"destructive"} size={"icon"} onClick={() => {}}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />


    </>
  );
};

export default SettingsForm;
