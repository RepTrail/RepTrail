export type UploaderType = 'workout' | 'diet';
export type Role = 'trainer' | 'student';
export type BindingMode = 'matched' | 'create' | 'skip';

export interface PdfUploaderProps {
    type: UploaderType;
    students?: any[];
    role?: Role;
    userId: string;
    studentId?: string;
}

export interface StudentMatch {
    exact: any | null;
    suggestions: any[];
}

export interface ParsedData {
    parsed_data: any;
    detected_student_name?: string;
}
