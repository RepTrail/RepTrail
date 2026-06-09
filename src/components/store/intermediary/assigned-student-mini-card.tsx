'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { BaseAvatar } from '@/components/store/base/avatar'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export interface AssignedStudentInfo {
    id: string
    name: string
    avatarUrl?: string | null
    isPlaceholder?: boolean
}

function AssignedStudentAvatar({ student }: { student: AssignedStudentInfo }) {
    const initials = student.name
        ? student.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    return (
        <BaseAvatar
            initials={initials}
            src={student.avatarUrl || undefined}
            size="sm"
            variant="primary"
        />
    )
}

/**
 * AssignedStudentsAvatarRow
 * Trainer-only: avatars of students assigned to a library item.
 */
export function AssignedStudentsAvatarRow({ students }: { students: AssignedStudentInfo[] }) {
    if (!students.length) return null

    return (
        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
            {students.map((student) => (
                <AssignedStudentAvatar key={student.id} student={student} />
            ))}
        </Stack>
    )
}

/** @deprecated Use AssignedStudentsAvatarRow */
export const AssignedStudentMiniCard = AssignedStudentsAvatarRow
