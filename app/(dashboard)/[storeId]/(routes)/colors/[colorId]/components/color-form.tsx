"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import * as z from "zod";

interface ColorFormProps {
  initialdata: Color | null;
}

const FormSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "String must be a valid hex code",
  }),
});

type ColorFormValues = z.infer<typeof FormSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ initialdata }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialdata ? "Edit color" : "Create color";
  const description = initialdata ? "Edit a color" : "Add a new color";
  const toastMessage = initialdata ? "Color Updated" : "Color Created";
  const action = initialdata ? "Save Changes" : "Create";

  const [color, setColor] = useState(initialdata?.value || "#ffffff");
  const [pickerOpen, setPickerOpen] = useState(false);

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialdata || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);

      if (initialdata) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }

      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);

      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast.success("Color deleted succesfully");
    } catch (error) {
      toast.error("Make Sure to removed all Products using this Color");
    } finally {
      setLoading(false);
    }
  };

  const toggleColorPicker = () => {
    setPickerOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onCLose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialdata && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        value={field.value || color}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setColor(e.target.value);
                        }}
                      />

                      <div
                        className="relative border p-4 rounded-full cursor-pointer"
                        style={{ backgroundColor: field.value }}
                        onClick={toggleColorPicker}
                      >
                        <div
                          className={cn(
                            "absolute right-0 mt-10",
                            pickerOpen ? "block" : "hidden"
                          )}
                        >
                          <HexColorPicker
                            color={color}
                            onChange={(newColor) => {
                              setColor(newColor);
                              field.onChange(newColor);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ColorForm;
