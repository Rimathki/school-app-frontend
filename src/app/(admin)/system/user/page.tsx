'use client';
import React, {useCallback, useMemo, useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import ExcelHelper from '@/lib/excel-helper';
import SideHeader from '@/components/layouts/side-header';
import { 
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetRolesQuery,
    useAssignUserRoleMutation,
    useUpdatePasswordMutation
} from '@/api/users';
import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import { userColumns } from '@/components/table/columns';
import MainDialog from '@/components/elements/main-dialog';
import { 
    userSchema, 
    passwordSchema, 
    userAddInfoSchema 
} from '@/utils/validation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast"
import AlerDialog from '@/components/elements/alert';
import { formatQuery } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, selectQuery } from "@/features/user-slice";
import Pagination from '@/components/table/pagination';
import { Combobox } from '@/components/elements/combobox';
import { User } from '@/utils/types'

const Page = () => {
    const breadcrumbsData = [
        { name: "System", path: "/system" },
        { name: "User list", path: "main" },
    ];
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            password: "",
            role_id: "",
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const dispatch = useDispatch();
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isPassDialogOpen, setPassDialogOpen] = useState<boolean>(false);
    const [isAdditionalInfoDialog, setAdditionalInfoDialog] = useState<boolean>(false);
    const [isAlertOpen, setAlertOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState('')
    const query = useSelector(selectQuery);
    const { data, error, isLoading } = useGetUsersQuery(formatQuery(query));
    const [createUser, createUserResponse] = useCreateUserMutation();
    const [updateUser, updateUserResponse] = useUpdateUserMutation();
    const [deleteUser, deleteResult] = useDeleteUserMutation();
    const { data: roles } = useGetRolesQuery();
    const [assignUserRole, { isLoading: userRoleLoading }] = useAssignUserRoleMutation();
    const [updatePassword] = useUpdatePasswordMutation();
    const isSubmitting = createUserResponse.isLoading || updateUserResponse.isLoading;
    const { toast } = useToast();
    const  userAddRoleForm= useForm<z.infer<typeof userAddInfoSchema>>({
        resolver: zodResolver(userAddInfoSchema),
        defaultValues: {
            role: '',
        },
    });

    const filteredRoles = roles?.filter(role => role.name !== 'Admin');

    const pagination = useMemo(() => {
        if (data?.pagination) return data.pagination;
        else return null;
    }, [data]);

    const handleExport = async () => {
        try {
            if (data?.users && data.users.length > 0) {
                const formattedData = data.users.map((user, index) => ({
                    index: index + 1, 
                    username: user.username,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    email: user.email,
                    phone: user.username,
                }));
                
                const columns = [
                    { header: "No", key: "index", width: 10 },
                    { header: "Username", key: "username", width: 30 },
                    { header: "lastname", key: "lastname", width: 30 },
                    { header: "firstname", key: "firstname", width: 30 },
                    { header: "email", key: "email", width: 50 },
                    { header: "phone", key: "phone", width: 15 },
                ];

                await ExcelHelper.generateAndDownloadExcel("users.xlsx", formattedData, columns);
    
                toast({
                    title: "Export Successful",
                    description: "The users data has been exported successfully.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "No Data",
                    description: "There is no data available for export.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: "An error occurred while exporting the data.",
            });
            console.log("Export Error:", error);
        }
    }; 

    const onSubmit = async (values: z.infer<typeof userSchema>) => {
        console.log(values)
        try {
            if (isEditing && editingUser) {
                const payload = { id: editingUser.id, body: values };
                await updateUser(payload).unwrap();
        
                toast({
                    title: "Success",
                    description: "User updated successfully",
                });
        
                form.reset();
                setDialogOpen(false);
                setIsEditing(false);
                setEditingUser(null);
            } else {
                await createUser(values).unwrap();
        
                toast({
                    title: "Success",
                    description: "User created successfully",
                });
        
                form.reset();
                setDialogOpen(false);
                setIsEditing(false);
                setEditingUser(null);
            }
        } catch (err) {
            const error = err as {
                data?: {
                    message?: string;
                };
            };
    
            const message = error?.data?.message || "An unexpected error occurred.";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };
      
    const userAdditionalInfo = (user: User) => {
        setAdditionalInfoDialog(true)
        setSelectedUser(user.id)
        userAddRoleForm.setValue('role', user?.role?.id || '')
    }

    const onSubmitAddInfo = async (values: z.infer<typeof userAddInfoSchema>) => {
        try {
            await assignUserRole({ userId: selectedUser, roleId: values.role as string }).unwrap();

            toast({
                title: "Success",
                description: "Role assigned successfully",
            });

            setSelectedUser('')
            setAdditionalInfoDialog(false)
            userAddRoleForm.reset()

        } catch (error) {
            console.log("Failed to assign role:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: 'Cant saving user role',
            });
        }
    }

    const editHandler = (user: User) => {
        form.setValue('username', user.username);
        form.setValue('firstname', user.firstname);
        form.setValue('lastname', user.lastname);
        form.setValue('phone', user.phone);
        form.setValue('email', user.email);
        form.setValue('password', '');
        setDialogOpen(true);
        setIsEditing(true)
        setEditingUser(user);
    };    
    
    const deleteHandler = (userId: string) => {
        if (userId) {
            setEditingUser({ id: userId } as User);
            setAlertOpen(true);
        }
    };

    const handleConfirm = async () => {
        if (editingUser) {
            try {
                await deleteUser(editingUser.id);
                if(deleteResult?.isSuccess)
                {
                    toast({
                        title: 'User Deleted',
                        description: deleteResult?.data?.message,
                    });
                }
            } catch {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to delete user.',
                });
            } finally {
                setAlertOpen(false);
            }
        }
    };

    const changePassword = (user: User) => {
        setSelectedUser(user.id);
        setPassDialogOpen(true);
    };

    const onSubmitPass = async (values: z.infer<typeof passwordSchema>) => {
        try {
            const { password } = values;
            await updatePassword({
                userId: selectedUser,
                newPassword: password,
            }).unwrap();
    
            toast({
                title: "Password Updated",
                description: "The user's password has been updated successfully.",
            });
    
            setPassDialogOpen(false);
            setSelectedUser('')
            passwordForm.reset();
        } catch (err) {
            const error = err as {
                data?: {
                    message?: string;
                };
            };
    
            const message = error?.data?.message || "Failed to update password.";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };

    const handlePage = useCallback(
        (value: number) => dispatch(setQuery({ page: value })),
        [dispatch]
    );

    const handleLimitChange = useCallback(
        (newLimit: number) => {
            dispatch(setQuery({ limit: newLimit }));
        },
        [dispatch]
    );

    const tableData = data?.users.map((user) => ({
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        password: user.password,
        email: user.email,
        phone: user.phone,
        role: user.role,
    })) || [];

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-shrink-0">
                <SideHeader breadcrumbs={breadcrumbsData} />
            </div>

            <div className="flex-auto rounded-md max-h-full overflow-y-auto px-10">
                <Datatable
                    tableData={tableData}
                    columns={userColumns(editHandler, deleteHandler, changePassword, userAdditionalInfo)}
                    isLoading={isLoading}
                    error={!!error}
                    pagination={{
                        start: pagination?.start ?? 1,
                        pageSize: pagination?.limit ?? 25,
                    }}
                >
                    <div className="w-full flex justify-between">
                        <div>
                            <Button 
                                className="w-full bg-blue-400 hover:bg-blue-500"
                                onClick={() => {setDialogOpen(true)}}
                            >
                                Create user
                            </Button>
                        </div>
                        <div className="flex gap-x-2">
                            <Button className='w-full bg-green-500 hover:bg-green-600 px-10' onClick={() => handleExport()}>
                                Export
                            </Button>
                        </div>
                    </div>
                </Datatable>
            </div>
            <div className="grow-0 shrink basis-1 px-5 lg:px-10 flex justify-between w-full">            
                {pagination !== null && pagination?.total > 4 && (
                    <Pagination pagination={pagination} select={handlePage} handleChangeLimit={handleLimitChange}/>
                )}
            </div>

            {/* create and edit user dialog */}
            <MainDialog
                title={isEditing? 'Edit user' : 'Create user'}
                description="Please enter accurate information"
                isOpen={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                    setEditingUser(null)
                    setIsEditing(false)
                    form.reset();
                }}
            >
                <div className=''>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full" autoComplete='off'>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Firstname</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Firstname" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Lastname</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Lastname" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Select Role</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filteredRoles?.map((role, index) => (
                                                        <SelectItem key={index} value={String(role.id)}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone" {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Email address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter new password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="w-full pt-5 flex gap-x-5">
                                <Button type="submit" disabled={isSubmitting} className='w-full'>{isSubmitting ? 'Saving' : 'Save user'}</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </MainDialog>

            {/* change password dialog */}
            <MainDialog
                title="Change password"
                description=""
                isOpen={isPassDialogOpen}
                onClose={() => {
                    setPassDialogOpen(false)
                    passwordForm.reset();
                }}
            >
                <div className=''>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onSubmitPass)} className="space-y-2 w-full" autoComplete='off'>
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter new password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Confirm password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Confirm new password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="w-full pt-5">
                                <Button type="submit" className='w-full'>Save password</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </MainDialog>

            <AlerDialog
                title="Delete user"
                description="You are about to delete the user. Please note that it cannot be restored!"
                isOpen={isAlertOpen}
                onClose={() => setAlertOpen(false)}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default Page;
