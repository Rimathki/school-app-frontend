import { ColumnDef } from "@tanstack/react-table";
import Actions from "../elements/actions";
import {
    Edit,
    Trash,
    KeyRound,
    StickyNote,
    CirclePlus
} from 'lucide-react'
import { Button } from "../ui/button";
import { User, Lesson, Teachers, Quiz } from '@/utils/types';
import { LEVEL } from "@/utils/params";

const userColumns = (editHandler: (user: User) => void, deleteHandler: (userId: string) => void, changePassword: (user: User) => void, userAdditionalInfo: (user: User) => void): ColumnDef<User>[] => [
    {
        accessorKey: "index",
        header: "№",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const globalIndex = pageIndex + row.index;
        
            return (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {globalIndex}
                </span>
            );
        },
        enableColumnFilter: false,
        size: 30,
        minSize: 30,
        maxSize: 30,
        meta: {
            className: "text-center" as string,
        },
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ getValue }) => (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getValue<string>()}
            </span>
        ),
        size: 150,
        minSize: 150,
        maxSize: 150,
    },
    {
        accessorKey: "lastname",
        header: "Fullname",
        cell: ({ row }) => {
            const firstname = row.original.firstname;
            const lastname = row.original.lastname;
            return (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {lastname} {firstname}
                </span>
            )
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-700 dark:text-gray-400">
                {getValue<string>()}
            </span>
        ),
        size: 100,
        minSize: 100,
        maxSize: 100,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-700 dark:text-gray-400">
                {getValue<string>()}
            </span>
        ),
        size: 100,
        minSize: 100,
        maxSize: 100,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          const userId = user.id
    
          const actions = [
            {
              label: <Edit width={16} height={16}/>,
              onClick: () => editHandler(user),
              className: "text-slate-500",
              tooltip: "Edit user"
            },
            {
              label: (
                <>
                  <Trash/> Delete
                </>
              ),
              onClick: () => deleteHandler(userId),
              className: "text-slate-500",
              isDrop: true
            },
            {
                label: (
                  <>
                    <KeyRound/> Password
                  </>
                ),
                onClick: () => changePassword(user),
                className: "text-slate-500",
                isDrop: true
            },
            {
                label: (
                  <>
                    <StickyNote/> Information
                  </>
                ),
                onClick: () => userAdditionalInfo(user),
                className: "text-slate-500",
                isDrop: true
            },
          ];
    
          return <Actions actions={actions} />;
        },
        enableColumnFilter: false,
        maxSize: 40,
    },
];

const lessonColumns = (editHandler: (lesson: Lesson) => void, deleteHandler: (lessonId: string) => void, showTopic: (lessonId: string) => void, showTeachers: (lessonId: string) => void): ColumnDef<Lesson>[] => [
    {
        accessorKey: "index",
        header: "№",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const globalIndex = pageIndex + row.index;
        
            return (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {globalIndex}
                </span>
            );
        },
        enableColumnFilter: false,
        size: 30,
        minSize: 30,
        maxSize: 30,
        meta: {
            className: "text-center" as string,
        },
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ getValue }) => (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
                { getValue<string>() }
            </span>
        ),
        size: 150,
        minSize: 150,
        maxSize: 150,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ getValue }) => (
            <span className="text-sm text-gray-700 dark:text-gray-400">
                {getValue<string>()}
            </span>
        ),
        size: 150,
        minSize: 150,
        maxSize: 150,
    },
    {
        accessorKey: "created_by",
        header: "Created by",
        cell: ({ row }) => {
            const lesson = row.original;
            const lastname = lesson.creator?.lastname
            const firstname = lesson.creator?.firstname
            return(
                <span className="text-sm text-gray-700 dark:text-gray-400">
                    {lastname?.substring(0, 1)}. {firstname}
                </span>
            )
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
    },
    {
        id: "topic",
        header: "Topic",
        cell: ({ row }) => {
            const lesson = row.original;
            const lessonId = lesson.id
            return(
                <Button onClick={() => showTopic(lessonId)} className="text-sm text-slate-700 bg-green-200 hover:bg-green-300">
                    Topic
                </Button>
            )
        },
        meta: {
            className: 'text-center'
        },
        size: 50,
        minSize: 50,
        maxSize: 50,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const lesson = row.original;
            const lessonId = lesson.id
        
            const actions = [
                {
                    label: <Edit width={16} height={16}/>,
                    onClick: () => editHandler(lesson),
                    className: "text-slate-500",
                    tooltip: "Edit lesson"
                },
                {
                    label: (
                        <>
                        <Trash/> Delete
                        </>
                    ),
                    onClick: () => deleteHandler(lessonId),
                    className: "text-slate-500",
                    isDrop: true
                },
                {
                    label: (
                        <>
                        <CirclePlus/> Add teacher
                        </>
                    ),
                    onClick: () => showTeachers(lessonId),
                    className: "text-slate-500",
                    isDrop: true
                },
            ];
        
            return <Actions actions={actions} />;
        },
        enableColumnFilter: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
    },
];

const teachersColumns = (addStudents: (teacherId: string) => void): ColumnDef<Teachers>[] => [
    {
        accessorKey: "index",
        header: "№",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const globalIndex = pageIndex + row.index;
        
            return (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {globalIndex}
                </span>
            );
        },
        enableColumnFilter: false,
        size: 30,
        minSize: 30,
        maxSize: 30,
        meta: {
            className: "text-center" as string,
        },
    },
    {
        id: "fullname",
        header: "Fullname",
        cell: ({ row }) => {
            const user = row.original;
            const firstname = user.firstname
            const lastname = user.lastname
            return(
                <span>
                    {lastname.substring(0, 1)}. {firstname}
                </span>
            )
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => {
            return(
                <span>
                    {getValue<string>()}
                </span>
            )
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
        enableColumnFilter: false,
    },
    {
        id: "lessons",
        header: "Lessons",
        cell: ({ row }) => {
            const { lessons } = row.original;
        
            return (
                <ul className="text-sm text-slate-700 px-2">
                    {lessons?.length === 0 ? (
                        <span className="bg-red-300 p-2 px-5 rounded-lg text-white hover:bg-red-400">Lesson not found</span>
                    ) : (
                        lessons?.map((lesson, index) => (
                            <li className="bg-blue-400 text-white rounded-lg my-2 p-2 px-5 hover:bg-blue-500" key={index}>{lesson.title}</li>
                        ))
                    )}
                </ul>
            );
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
    },
    {
        id: "students",
        header: "Students",
        cell: ({ row }) => {
            const teacherId = row.original.id;
            return (
                <Button onClick={() => addStudents(teacherId)} className="bg-green-500 hover:bg-green-600 text-white">Students</Button>
            );
        },
        meta: {
            className: 'text-center' as string
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
    },
];

const quizColumns = (editQuestionAnswer: (quizId: string) => void): ColumnDef<Quiz>[] => [
    {
        accessorKey: "index",
        header: "№",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const globalIndex = pageIndex + row.index;
        
            return (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {globalIndex}
                </span>
            );
        },
        enableColumnFilter: false,
        size: 30,
        minSize: 30,
        maxSize: 30,
        meta: {
            className: "text-center" as string,
        },
    },
    {
        accessorKey: "topics",
        header: "topics",
        cell: ({ getValue }) => {
            return(
                <span>
                    {getValue<string>()}
                </span>
            )
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
        enableColumnFilter: false,
    },
    {
        accessorKey: "level",
        header: "level",
        cell: ({ getValue }) => {
            const level = Number(getValue<string>())
            return(
                <span>
                    {LEVEL[level]}
                </span>
            )
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
        enableColumnFilter: false,
    },
    {
        accessorKey: "duration",
        header: "duration",
        cell: ({ getValue }) => {
            return(
                <span>
                    {getValue<string>()} sec
                </span>
            )
        },
        size: 150,
        minSize: 150,
        maxSize: 150,
        enableColumnFilter: false,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const quiz = row.original;
            const quizId = quiz.id
        
            const actions = [
                {
                    label: <Edit width={16} height={16}/>,
                    onClick: () => editQuestionAnswer(quizId),
                    className: "text-slate-500",
                    tooltip: "Edit question and answers"
                },
            ];
        
            return <Actions actions={actions} />;
        },
        enableColumnFilter: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
    },
];

export { 
    userColumns,
    lessonColumns,
    teachersColumns,
    quizColumns
};