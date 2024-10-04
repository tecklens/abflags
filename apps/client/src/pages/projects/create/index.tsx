import { Layout, LayoutBody, LayoutHeader } from "@client/components/custom/layout";
import { Search } from "@client/components/search";
import ThemeSwitch from "@client/components/theme-switch";
import { UserNav } from "@client/components/user-nav";
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { Link } from "react-router-dom";
import { PasswordInput } from "@client/components/custom/password-input";
import { Button } from "@client/components/custom/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Please enter project name' })
    .max(64, { message: 'Maximum 64 characters' }),
  description: z
    .string()
    .max(256, {
      message: 'Maximum 256 characters',
    })
    .optional(),
})

export default function CreateProjectPage() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="flex flex-col gap-3 justify-center items-center" fixedHeight>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-md w-full"
          >
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input placeholder="Submit email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="tecklens" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-2" disabled={isLoading}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </LayoutBody>
    </Layout>
  )
}
