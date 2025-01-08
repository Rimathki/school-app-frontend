"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { Controller, Control, FieldError } from "react-hook-form";
import { File, FileText, FileImage, FileCheck, Import } from "lucide-react";

interface FileInputProps {
    name: string;
    control: Control<any>;
    label?: string;
    accept?: Record<string, string[]>;
    maxSize?: number;
    multiple?: boolean;
    error?: FieldError;
}

const FileInput: React.FC<FileInputProps> = ({
    name,
    control,
    label = "Upload File",
    accept = { "application/pdf": [".pdf"] },
    maxSize = 4 * 1024 * 1024,
    multiple = false,
    error,
}) => {
    const getFileIcon = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase();
        if (extension === "pdf") return <FileText className="text-red-500" />;
        if (["jpg", "jpeg", "png", "gif"].includes(extension || ""))
            return <FileImage className="text-blue-500" />;
        if (["txt", "doc", "docx"].includes(extension || ""))
            return <FileCheck className="text-green-500" />;
        return <File className="text-gray-500" />;
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium">{label}</label>}
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const { getRootProps, getInputProps, isDragActive } = useDropzone({
                        accept,
                        maxSize,
                        multiple,
                        onDrop: (files) => {
                            field.onChange(multiple ? files : files[0]);
                        },
                    });

                    return (
                        <div
                            {...getRootProps({
                                className: `border rounded-md p-4 flex flex-col items-center justify-center cursor-pointer ${
                                    isDragActive
                                        ? "border-blue-500 bg-blue-100"
                                        : error
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`,
                            })}
                        >
                            <input {...getInputProps()} />
                            <Import className="h-24 w-24 mb-5 text-slate-500" />
                            <p className="text-sm text-gray-600">
                                Drag 'n' drop your files here, or click to select
                            </p>
                            <p className="text-xs text-gray-500">
                                {multiple
                                    ? "You can upload multiple files."
                                    : "Only one file can be uploaded."}
                            </p>
                            {field.value && (
                                <ul className="mt-2 text-sm text-gray-600">
                                    {multiple ? (
                                        (field.value as File[]).map((file: File) => (
                                            <li key={file.name} className="flex items-center gap-2">
                                                {getFileIcon(file.name)}
                                                <span>{file.name}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex items-center gap-2">
                                            {getFileIcon((field.value as File).name)}
                                            <span>{(field.value as File).name}</span>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    );
                }}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
};

export default FileInput;
