import type React from "react";

export interface UploadZoneProps {
    label: string;
    file: File | null;
    onClear: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface User {
    id? : String;
    name? : String;
    email? : String;

}

export interface Project {
    id: String;
    name: String;
    userId: String;
    user?: User;
    productName : String
    productDescription : String;
    userPrompt : String;
    aspectRatio : String;
    targetLeangth? : number;
    generatedImage?: String;
    generatedVideo?: String;
    isGenerating: boolean;
    isPublished: boolean;
    error?: String;
    createdAt?: Date | String;
    updatedAt?: Date | String;

}