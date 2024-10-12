import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@client/components/ui/dialog';
import { Button } from '@client/components/custom/button';
import { IconPlus } from '@tabler/icons-react';
import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@client/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@client/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@client/components/ui/select';
import { Switch } from '@client/components/ui/switch';
import { RepositoryFactory } from '@client/api/repository-factory';
import { useToast } from '@client/components/ui/use-toast';
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { NumberParam, useQueryParam, useQueryParams } from 'use-query-params';

const ProjectRepository = RepositoryFactory.get('project');

const varTypes = ['string', 'number', 'boolean', 'date'];

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Variable must be at least 3 characters long' })
    .max(64, { message: 'Variable max 25 characters long' })
    .refine(
      (value) => /^[a-zA-Z][a-zA-Z0-9]*?[a-zA-Z0-9]$/.test(value ?? ''),
      'Variable should contain only alphabets, _',
    ),
  type: z.enum(['string', ...varTypes]),
  defaultValue: z.string().optional(),
  isDefault: z.boolean(),
  required: z.boolean(),
});

export default function AddVariable() {
  const [v, setV] = useQueryParam('v', NumberParam);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'string',
      defaultValue: '',
      isDefault: false,
      required: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    ProjectRepository.createVariable(data)
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Created) {
          toast({
            title: 'Create variable successful',
          });
        }
        setV((v ?? 0) + 1);
        setOpen(false);
      })
      .catch((e: any) => {
        if (axios.isAxiosError(e)) {
          toast({
            title: 'Update failed',
            description: e.message,
            variant: 'destructive',
          });
        }
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={'sm'}>
          <IconPlus size={16} />
          Add variable
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add variable</DialogTitle>
        <Form {...form}>
          <form
            id={'add-variable'}
            onSubmit={form.handleSubmit(onSubmit)}
            className={'grid gap-3'}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable name</FormLabel>
                  <FormControl>
                    <Input placeholder={'Ex: currentDate'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="col-span-2 w-full min-w-auto">
                        <SelectValue placeholder="Select a var type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{field.value}</SelectLabel>
                          {varTypes.map((e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value</FormLabel>
                  <FormControl>
                    <Input placeholder={'Ex: 09434xx'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className={'flex flex-col'}>
                  <FormLabel>Required</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button form={'add-variable'} type={'submit'}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
